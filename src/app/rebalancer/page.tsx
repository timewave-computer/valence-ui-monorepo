"use client";
import { ComingSoonTooltipContent, Dropdown } from "@/components";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { fetchHistoricalValues, fetchLivePortfolio } from "@/server/actions";
import {
  Graph,
  Table,
  ValueTooltip,
  SidePanel,
  SidePanelV2,
  TableV2,
  AccountDetails,
} from "@/app/rebalancer/components";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  useAccountConfigQuery,
  useGraphOverlay,
  useHistoricalValueGraph,
} from "@/app/rebalancer/hooks";
import { Label, Line, ReferenceLine, Tooltip } from "recharts";
import {
  Scale,
  GraphKey,
  LOAD_CONFIG_ERROR,
  SymbolColors,
  GraphStyles,
  scaleAtom,
  accountAtom,
} from "@/app/rebalancer/const";
import { USDC_DENOM } from "@/const/chain-data";
import { createPortal } from "react-dom";
import { Overlay } from "@/components/Overlay";
import { StatusBar } from "@/components/StatusBar";
import { FiAlertTriangle } from "react-icons/fi";
import { LinkText } from "@/components";
import Image from "next/image";
import { X_HANDLE, X_URL } from "@/const/socials";
import { FeatureFlags, useFeatureFlag } from "@/utils";
import { cn } from "@/utils";
import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";
import { useAtom } from "jotai";
import { useWallet } from "@/hooks";

const RebalancerPage = () => {
  const [baseDenom, setBaseDenom] = useQueryState("baseDenom", {
    defaultValue: USDC_DENOM,
  });
  const { isWalletConnected, address } = useWallet();
  const [account] = useAtom(accountAtom);
  const isHasAccountInput = !!account && account !== "";
  const accountConfigQuery = useAccountConfigQuery({
    account,
    enabled: isHasAccountInput,
  });

  const isValidAccount =
    isHasAccountInput &&
    accountConfigQuery.error !== LOAD_CONFIG_ERROR.INVALID_ACCOUNT;

  const targets = useMemo(
    () => accountConfigQuery.data?.targets ?? [],
    [accountConfigQuery.data?.targets],
  );

  const [isRefetchLiveEnabled, setIsRefetchLiveEnabled] = useState(true);

  const isFetchLivePortfolioEnabled =
    !!account && !!baseDenom && !!targets?.length;
  const livePortfolioQuery = useQuery({
    staleTime: 60 * 1000,
    queryKey: [QUERY_KEYS.LIVE_PORTFOLIO, account, baseDenom, targets],
    retry: (errorCount) => {
      if (errorCount > 1) {
        setIsRefetchLiveEnabled(false);
      }
      return false;
    },
    refetchInterval: isRefetchLiveEnabled ? 10000 : false,
    queryFn: async () =>
      fetchLivePortfolio({
        address: account,
        baseDenom: baseDenom,
        targets: targets,
      }),
    enabled: isFetchLivePortfolioEnabled,
  });

  const historicalValuesQuery = useQuery({
    staleTime: 5 * 60 * 1000,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [QUERY_KEYS.HISTORICAL_VALUES, account],
    refetchInterval: 0, // data is historical, no need to refresh for now
    retry: 0,
    queryFn: async () => {
      const midnightUTC = new UTCDate(new UTCDate().setHours(0, 0, 0, 0));
      const startDate = subDays(midnightUTC, 365);
      const endDate = midnightUTC;
      return fetchHistoricalValues({
        targets: targets,
        baseDenom: baseDenom,
        address: account,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    },
    enabled: isValidAccount && !!targets.length,
  });

  const [scaleUrlParam, setScaleUrlParam] = useQueryState(
    "scale",
    parseAsStringEnum<Scale>(Object.values(Scale)).withDefault(Scale.Month),
  );
  const [scale, setScale] = useAtom(scaleAtom);
  useEffect(() => {
    setScale(scaleUrlParam);
  }, [setScale, scaleUrlParam]);

  const { xAxisTicks, yAxisTicks, graphData, keys, todayTimestamp } =
    useHistoricalValueGraph({
      data: historicalValuesQuery.data?.values,
      config: accountConfigQuery.data,
      livePortfolio: livePortfolioQuery.data?.portfolio,
      historicalTargets: historicalValuesQuery.data?.historicalTargets,
      scale,
    });

  const isNonUsdValueEnabled = useFeatureFlag(
    FeatureFlags.REBALANCER_NONUSDC_VALUE,
  );

  const isCreateRebalancerEnabled = useFeatureFlag(
    FeatureFlags.REBALANCER_CREATE,
  );

  const graphRef = useRef<HTMLDivElement>(null);
  const { portalPosition, overlayRef } = useGraphOverlay(graphRef);

  const GraphMessages = () => {
    if (!isHasAccountInput) {
      return <StatusBar variant="primary" text="Please enter an account" />;
    } else if (
      accountConfigQuery.isLoading ||
      historicalValuesQuery.isLoading
    ) {
      return <StatusBar variant="loading" />;
    } else if (accountConfigQuery.isError) {
      return accountConfigQuery.error === LOAD_CONFIG_ERROR.INVALID_ACCOUNT ? (
        <StatusBar
          variant="error"
          text="Invalid rebalancer account"
          icon={<FiAlertTriangle />}
        />
      ) : (
        <StatusBar
          variant="error"
          text="Could not fetch account"
          icon={<FiAlertTriangle />}
        />
      );
    } else if (historicalValuesQuery.isError) {
      return (
        <StatusBar
          variant="error"
          text="Could not load historical data for account"
          icon={<FiAlertTriangle />}
        />
      );
    }
  };

  // used to track when hovering over scrollable side panel
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // to track cursor when it moves
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  const [isDisabledElementHovered, setIsDisabledElementHovered] =
    useState(false);
  const [delayHandler, setDelayHandler] = useState<number | null>(null); // hack to keep tooltip open when moving mouse towards it
  const debouncedMouseEnter = () => {
    setIsDisabledElementHovered(true);
    if (delayHandler !== null) clearTimeout(delayHandler);
  };
  const debouncedMouseLeave = () => {
    setDelayHandler(
      window.setTimeout(() => {
        setIsDisabledElementHovered(false);
      }, 100),
    );
  };

  const [showTargets, setShowTargets] = useState(false);

  return (
    <div className="flex grow flex-row overflow-hidden">
      {isDisabledElementHovered && (
        <div
          onMouseEnter={debouncedMouseEnter}
          onMouseLeave={debouncedMouseLeave}
          style={{
            top: `${cursorPosition.y - 88}px`, // assign height of tooltip dynamically
          }}
          className={cn(
            "absolute left-[392px] z-50 flex w-64 grow border-[0.5px]",
            "animate-in  fade-in-0 zoom-in-95 border-valence-black bg-valence-white p-4 drop-shadow-md",
          )}
        >
          <ComingSoonTooltipContent />
        </div>
      )}

      {isCreateRebalancerEnabled ? (
        <SidePanelV2 isLoading={accountConfigQuery.isLoading} />
      ) : (
        <div
          onPointerMove={handlePointerMove}
          className="flex w-96 shrink-0 flex-col items-stretch overflow-hidden overflow-y-auto border-r border-valence-black"
        >
          <div className="flex flex-col gap-2 border-valence-black px-4">
            <Image
              className="mb-6 mt-8"
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              width={236}
              height={140}
            />
            <h1 className="text-xl font-bold">Rebalancer (beta)</h1>
            <p>
              Contact{" "}
              <LinkText
                className="border-valence-black text-valence-black hover:border-b"
                href={X_URL}
              >
                {X_HANDLE}
              </LinkText>{" "}
              if you or your DAO want early access to the Rebalancer.
            </p>
          </div>

          <SidePanel
            isValidAccount={isValidAccount}
            isLoading={accountConfigQuery?.isLoading}
            debouncedMouseEnter={debouncedMouseEnter}
            debouncedMouseLeave={debouncedMouseLeave}
          />
        </div>
      )}
      <div className="flex min-w-[824px] grow flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
        <div className="flex flex-row items-stretch justify-between border-b border-valence-black px-4 py-2">
          {isNonUsdValueEnabled && (
            <Dropdown
              options={VALUE_BASE_OPTIONS}
              selected={baseDenom}
              onSelected={setBaseDenom}
            />
          )}

          <div className="flex min-w-[824px] flex-row items-center gap-8 overflow-clip pr-2">
            {scales.map((thisScale) => (
              <div
                key={thisScale}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center text-base",
                  accountConfigQuery.isError ||
                    historicalValuesQuery.isError ||
                    historicalValuesQuery.isLoading
                    ? "cursor-not-allowed text-valence-gray"
                    : "",
                  scale === thisScale
                    ? "text-valence-black"
                    : "text-valence-gray",
                )}
                onClick={() => {
                  if (
                    !accountConfigQuery.isError &&
                    !historicalValuesQuery.isError &&
                    !historicalValuesQuery.isLoading
                  )
                    setScaleUrlParam(thisScale as Scale);
                }}
              >
                <p>1{thisScale.toUpperCase()}</p>
              </div>
            ))}
          </div>

          <button
            disabled={!graphData.length}
            className={cn(
              "text-sm",
              !graphData.length &&
                "cursor-not-allowed text-nowrap text-valence-gray",
            )}
            onClick={() => setShowTargets(!showTargets)}
          >
            {showTargets ? "Hide Targets" : "Show Targets"}
          </button>
        </div>
        {graphRef?.current &&
          GraphMessages() &&
          createPortal(
            <Overlay
              className={cn("overflow-hidden bg-transparent opacity-0")}
              position={portalPosition}
              ref={overlayRef}
            >
              <div className="flex flex-col justify-center gap-6">
                <GraphMessages />
              </div>
            </Overlay>,
            graphRef.current,
          )}
        <Graph
          ref={graphRef}
          scale={scale}
          xAxisTicks={xAxisTicks}
          yAxisTicks={yAxisTicks}
          data={graphData}
        >
          <Tooltip
            content={
              <ValueTooltip keys={[...keys.values, ...keys.projections]} />
            }
          />

          {accountConfigQuery?.data?.targets.map((target) => {
            const historicalValue = GraphKey.historicalValue(target.asset.name);
            const projectedValue = GraphKey.projectedValue(target.asset.name);
            const historicalTarget = GraphKey.historicalTargetValue(
              target.asset.name,
            );
            const projectedTarget = GraphKey.projectedTargetValue(
              target.asset.name,
            );
            return (
              <Fragment key={`line-${target.denom}`}>
                <ReferenceLine
                  key={`label-target-${target.denom}`}
                  x={todayTimestamp}
                  stroke="black"
                  isFront
                >
                  <Label
                    value="Today"
                    position="insideTopLeft"
                    style={{ fill: "black" }}
                    offset={10}
                  />
                </ReferenceLine>

                <Line
                  dataKey={historicalValue}
                  type="monotone"
                  dot={false}
                  strokeWidth={GraphStyles.width.regular}
                  stroke={SymbolColors.get(target.asset.symbol)}
                  isAnimationActive={false}
                  strokeDasharray={GraphStyles.lineStyle.solid}
                />
                {showTargets && (
                  <>
                    <Line
                      dataKey={historicalTarget}
                      type="monotone"
                      dot={false}
                      activeDot={false}
                      stroke={SymbolColors.get(target.asset.symbol)}
                      strokeWidth={GraphStyles.width.thin}
                      isAnimationActive={false}
                      strokeDasharray={GraphStyles.lineStyle.solid}
                    />
                    <Line
                      dataKey={projectedTarget}
                      type="monotone"
                      dot={false}
                      activeDot={false}
                      stroke={SymbolColors.get(target.asset.symbol)}
                      strokeWidth={GraphStyles.width.thin}
                      isAnimationActive={false}
                      strokeDasharray={GraphStyles.lineStyle.solid}
                    />
                  </>
                )}
                <Line
                  dataKey={projectedValue}
                  type="monotone"
                  dot={false}
                  stroke={SymbolColors.get(target.asset.symbol)}
                  isAnimationActive={false}
                  strokeWidth={GraphStyles.width.regular}
                  strokeDasharray={GraphStyles.lineStyle.dotted}
                />
              </Fragment>
            );
          })}
        </Graph>
        {isCreateRebalancerEnabled ? (
          <>
            <div className="flex grow overflow-x-auto border-t border-valence-black bg-valence-white ">
              <section className="w-1/3 border-r border-valence-black">
                <AccountDetails
                  selectedAddress={account}
                  isLoading={accountConfigQuery.isLoading}
                />
              </section>
              <section className="flex w-2/3 flex-col gap-4 pt-4">
                <h1 className="pl-4 text-base font-bold">Live Balances</h1>

                <TableV2
                  isLoading={
                    livePortfolioQuery.isFetching && !livePortfolioQuery.data
                  }
                  livePortfolio={livePortfolioQuery.data}
                />
              </section>
            </div>
          </>
        ) : (
          <div className="grow overflow-x-auto bg-valence-white">
            <Table
              isLoading={
                livePortfolioQuery.isFetching && !livePortfolioQuery.data
              }
              livePortfolio={livePortfolioQuery.data}
            />
            {livePortfolioQuery.isError &&
              !accountConfigQuery.isError &&
              !historicalValuesQuery.isError &&
              !historicalValuesQuery.isFetching && (
                <StatusBar
                  className="border-0"
                  variant="error"
                  text="Could not load live portfolio"
                  icon={<FiAlertTriangle />}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RebalancerPage;

const VALUE_BASE_OPTIONS: { label: string; value: string }[] = [
  {
    label: "USD Value",
    value: "usd",
  },
  {
    label: "Base Token Value",
    value: "baseToken",
  },
];

const scales = Object.values(Scale);

let DEFAULT_ACCOUNT = "";
if (process.env.NODE_ENV === "development") {
  DEFAULT_ACCOUNT = process.env.NEXT_PUBLIC_DEFAULT_ACCT ?? "";
}
