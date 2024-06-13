"use client";
import { DropdownDEPRECATED } from "@/components";
import { Fragment, useMemo, useRef, useState } from "react";
import { FeatureFlags, cn } from "@/utils";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { fetchHistoricalValues, fetchLivePortfolio } from "@/server/actions";
import {
  Graph,
  Table,
  ValueTooltip,
  SidePanel,
} from "@/app/rebalancer/components";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  useAccountConfigQuery,
  useGraphOverlay,
  useHistoricalValueGraph,
} from "@/app/rebalancer/hooks";
import { Label, Line, ReferenceLine, Tooltip } from "recharts";
import { useSetLocalTime } from "@/ui-globals";
import {
  Scale,
  GraphKey,
  LOAD_CONFIG_ERROR,
  SymbolColors,
} from "@/app/rebalancer/const";
import { USDC_DENOM } from "@/const/usdc";
import { createPortal } from "react-dom";
import { Overlay } from "@/components/Overlay";
import { StatusBar } from "@/components/StatusBar";
import { FiAlertTriangle } from "react-icons/fi";
import { MobileOverlay, LinkText } from "@/components";
import Image from "next/image";
import { X_HANDLE, X_URL } from "@/const/socials";

const RebalancerPage = () => {
  const [baseDenom, setBaseDenom] = useQueryState("baseDenom", {
    defaultValue: USDC_DENOM,
  });
  const [account, setAccount] = useQueryState("account", {
    defaultValue: DEFAULT_ACCOUNT,
  });

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
  const { localTime } = useSetLocalTime();
  const historicalValuesQuery = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: [
      QUERY_KEYS.HISTORICAL_VALUES,
      account,
      baseDenom,
      targets,
      localTime.midnightOneYearAgoUTC,
      localTime.midnightUTC,
    ],
    refetchInterval: 0, // data is historical, no need to refresh for now
    retry: 0,
    queryFn: async () => {
      return fetchHistoricalValues({
        targets: targets,
        baseDenom: baseDenom,
        address: account,
        startDate: localTime.midnightOneYearAgoUTC,
        endDate: localTime.midnightUTC,
      });
    },
    enabled: isValidAccount && !!targets.length,
  });

  const {
    scale,
    setScale,
    xAxisTicks,
    yAxisTicks,
    graphData,
    keys,
    todayTimestamp,
  } = useHistoricalValueGraph({
    data: historicalValuesQuery.data?.values,
    config: accountConfigQuery.data,
    livePortfolio: livePortfolioQuery.data?.portfolio,
  });

  const REBALANCER_NON_USDC_VALUE_ENABLED =
    FeatureFlags.REBALANCER_NON_USDC_VALUE_ENABLED();

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
  return (
    <main className="flex min-h-0 grow flex-col bg-valence-white text-valence-black">
      <MobileOverlay text="The Rebalancer is only available on desktop." />
      <div className="hidden min-h-0 grow flex-row items-stretch sm:flex">
        <div className="flex w-[24rem] shrink-0 flex-col items-stretch overflow-hidden overflow-y-auto border-r border-valence-black">
          <div className="flex flex-col gap-2 border-b border-valence-black px-4 pb-8">
            <Image
              className="mb-6 mt-8"
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              width={236}
              height={140}
            />
            <h1 className="text-xl font-bold">Rebalancer (beta)</h1>
            <p>
              Contact <LinkText href={X_URL}>{X_HANDLE}</LinkText> if you or
              your DAO want early access to the Rebalancer.
            </p>
          </div>

          <SidePanel
            account={account}
            setAccount={setAccount}
            isValidAccount={isValidAccount}
            isLoading={accountConfigQuery?.isLoading}
          />
        </div>
        <div className="flex grow flex-col overflow-y-auto bg-valence-lightgray text-sm">
          <div className="flex flex-row items-stretch justify-between border-b border-valence-black px-4 py-2">
            {REBALANCER_NON_USDC_VALUE_ENABLED && (
              <DropdownDEPRECATED
                options={VALUE_BASE_OPTIONS}
                selected={baseDenom}
                onSelected={setBaseDenom}
              />
            )}

            <div className="flex flex-row items-center gap-8 pr-2">
              {scales.map((thisScale) => (
                <div
                  key={thisScale}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center text-base",
                    accountConfigQuery.isError || historicalValuesQuery.isError
                      ? "cursor-not-allowed"
                      : "",
                    scale === thisScale
                      ? "text-valence-black"
                      : "text-valence-gray",
                  )}
                  onClick={() => {
                    if (
                      !accountConfigQuery.isError &&
                      !historicalValuesQuery.isError
                    )
                      setScale(thisScale as Scale);
                  }}
                >
                  <p>1{thisScale.toUpperCase()}</p>
                </div>
              ))}
            </div>
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
            <ReferenceLine x={todayTimestamp} stroke="black" isFront>
              <Label
                value="Today"
                position="insideTopLeft"
                style={{ fill: "black" }}
                offset={10}
              />
            </ReferenceLine>
            {accountConfigQuery?.data?.targets.map((target) => {
              const valuekey = GraphKey.value(target.asset.name);
              const projectionKey = GraphKey.projectedValue(target.asset.name);
              return (
                <Fragment key={`line-${target.denom}`}>
                  <Line
                    dataKey={valuekey}
                    type="monotone"
                    dot={false}
                    stroke={SymbolColors.get(target.asset.symbol)}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey={projectionKey}
                    type="monotone"
                    dot={false}
                    stroke={SymbolColors.get(target.asset.symbol)}
                    isAnimationActive={false}
                    strokeDasharray="3 3"
                  />
                </Fragment>
              );
            })}
          </Graph>
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
        </div>
      </div>
    </main>
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
