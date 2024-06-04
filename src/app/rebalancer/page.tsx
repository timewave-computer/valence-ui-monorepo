"use client";
import { Button, Dropdown, TextInput } from "@/components";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FeatureFlags, cn } from "@/utils";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHistoricalValues,
  fetchValenceAccountConfiguration,
  fetchLivePortfolio,
} from "@/server/actions";
import { useAtom } from "jotai";
import {
  Graph,
  Table,
  ValueTooltip,
  ConfigPanel,
  TooltipWrapper,
  ComingSoonTooltipContent,
} from "@/app/rebalancer/components";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  useGraphOverlay,
  useHistoricalValueGraph,
} from "@/app/rebalancer/hooks";
import { Label, Line, ReferenceLine, Tooltip } from "recharts";
import { UTCDate } from "@date-fns/utc";
import { DenomColorIndexMap, denomColorIndexMap } from "@/ui-globals";
import {
  Scale,
  GraphKey,
  GraphColor,
  LOAD_CONFIG_ERROR,
} from "@/app/rebalancer/const";
import { USDC_DENOM } from "@/const/usdc";
import { createPortal } from "react-dom";
import { Overlay } from "@/components/Overlay";
import { StatusBar } from "@/components/StatusBar";
import { FiAlertTriangle } from "react-icons/fi";
import { ERROR_CODES, InvalidAccountError } from "@/const/error";

const RebalancerPage = () => {
  const [baseDenom, setBaseDenom] = useQueryState("baseDenom", {
    defaultValue: USDC_DENOM,
  });
  const [valenceAccount, setValenceAccount] = useQueryState("account", {
    defaultValue: DEFAULT_ACCOUNT,
  });

  // error handled from here and not from accountConfigQuery.isError
  const [loadConfigError, setLoadConfigError] =
    useState<null | LOAD_CONFIG_ERROR>(null);

  const isHasAccountInput = !!valenceAccount && valenceAccount !== "";
  const isValidAccount =
    isHasAccountInput && loadConfigError !== LOAD_CONFIG_ERROR.INVALID_ACCOUNT;
  const accountConfigQuery = useQuery({
    queryKey: [QUERY_KEYS.VALENCE_ACCOUNT_CONFIG, valenceAccount],
    queryFn: async () => {
      setLoadConfigError(null);
      try {
        return await fetchValenceAccountConfiguration({
          address: valenceAccount,
        });
      } catch (e) {
        // have to do it this way because server action -> client loses context of erorr instance
        if (InvalidAccountError.name === ERROR_CODES.InvalidAccountError) {
          setLoadConfigError(LOAD_CONFIG_ERROR.INVALID_ACCOUNT);
        } else {
          setLoadConfigError(LOAD_CONFIG_ERROR.API_ERROR);
        }
        // error should be handled from here and not from the isError prop
      }
    },
    enabled: isHasAccountInput,
  });
  const targets = useMemo(
    () => accountConfigQuery.data?.targets ?? [],
    [accountConfigQuery.data?.targets],
  );
  const [colorIndexMap, setColorIndexMap] = useAtom(denomColorIndexMap);
  useEffect(() => {
    if (!targets.length) return;
    const colorIndexMap: DenomColorIndexMap = {};
    targets.map((target, i) => {
      colorIndexMap[target.denom] = i;
    });
    setColorIndexMap(colorIndexMap);
  }, [targets, setColorIndexMap]);

  const [isRefetchLiveEnabled, setIsRefetchLiveEnabled] = useState(true);

  const isFetchLivePortfolioEnabled =
    !!valenceAccount && !!baseDenom && !!targets?.length;
  const livePortfolioQuery = useQuery({
    queryKey: [QUERY_KEYS.LIVE_PORTFOLIO, valenceAccount, baseDenom, targets],
    retry: (errorCount) => {
      if (errorCount > 1) {
        setIsRefetchLiveEnabled(false);
      }
      return false;
    },
    refetchInterval: isRefetchLiveEnabled ? 10000 : false,
    queryFn: async () =>
      fetchLivePortfolio({
        address: valenceAccount,
        baseDenom: baseDenom,
        targets: targets,
      }),
    enabled: isFetchLivePortfolioEnabled,
  });

  const historicalValuesQuery = useQuery({
    queryKey: [
      QUERY_KEYS.HISTORICAL_VALUES,
      valenceAccount,
      baseDenom,
      targets,
    ],
    refetchInterval: 0, // data is historical, no need to refresh for now
    retry: 0,
    queryFn: async () => {
      let startDate = new UTCDate();
      startDate.setHours(0, 0, 0, 0);

      return fetchHistoricalValues({
        targets: targets,
        baseDenom: baseDenom,
        address: valenceAccount,
        startDate: startDate,
        endDate: startDate, // nothing is done with this yet, its mock data
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
    if (
      accountConfigQuery.isLoading ||
      (historicalValuesQuery?.isLoading && !historicalValuesQuery.data)
    ) {
      return <StatusBar variant="loading" text="" />;
    }
    if (!isHasAccountInput) {
      return <StatusBar variant="info" text="Please enter an account" />;
    } else if (loadConfigError === LOAD_CONFIG_ERROR.INVALID_ACCOUNT) {
      return (
        <StatusBar
          variant="error"
          text="Invalid account"
          icon={<FiAlertTriangle />}
        />
      );
    } else if (loadConfigError === LOAD_CONFIG_ERROR.API_ERROR) {
      return (
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
    <main className="flex min-h-0 min-w-[px] grow flex-col bg-valence-white text-valence-black">
      <div className="flex min-h-0 grow flex-row items-stretch">
        <div className="flex w-[24rem] shrink-0 flex-col items-stretch overflow-hidden overflow-y-auto border-r border-valence-black">
          <div className="flex flex-col gap-2 border-b border-valence-black px-4 pb-8">
            <Image
              className="mb-6 mt-8"
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              width={236}
              height={140}
            />

            <h1 className="text-xl font-bold">Rebalancer</h1>
            <p>
              To get started with the Rebalancer, create a governance proposal
              to deposit funds into a Rebalancer account with a portfolio
              target.
            </p>
          </div>

          <div className="flex flex-col gap-6 border-b border-valence-black p-4 pb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold">Rebalancer account</h1>

              <TextInput
                input={valenceAccount}
                onChange={setValenceAccount}
                placeholder="neutron12345..."
                textClassName="font-mono"
                containerClassName="w-full"
              />

              <TooltipWrapper
                asChild
                content={<ComingSoonTooltipContent />}
                trigger={
                  <Button className="mt-2" onClick={() => {}} disabled>
                    Connect wallet
                  </Button>
                }
              />
            </div>
            <ConfigPanel
              isLoading={accountConfigQuery.isLoading}
              isValidValenceAccount={isValidAccount}
              config={accountConfigQuery.data}
            />
          </div>
        </div>

        <div className="flex grow flex-col overflow-y-auto bg-valence-lightgray text-sm">
          <div className="flex flex-row items-stretch justify-between border-b border-valence-black px-4 py-2">
            {REBALANCER_NON_USDC_VALUE_ENABLED && (
              <Dropdown
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
                    scale === thisScale
                      ? "text-valence-black"
                      : "text-valence-gray",
                  )}
                  onClick={() => setScale(thisScale as Scale)}
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
              const colorIndex = colorIndexMap[target.denom];
              return (
                <Fragment key={`line-${target.denom}`}>
                  <Line
                    dataKey={valuekey}
                    type="monotone"
                    dot={false}
                    stroke={GraphColor.get(colorIndex)}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey={projectionKey}
                    type="monotone"
                    dot={false}
                    stroke={GraphColor.get(colorIndex)}
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
              !loadConfigError &&
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
