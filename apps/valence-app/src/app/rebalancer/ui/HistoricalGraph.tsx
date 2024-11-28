"use client";
import { Dropdown } from "@/components";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Graph, ValueTooltip, CreateAccountCTA } from "@/app/rebalancer/ui";
import {
  useAccountConfigQuery,
  useAssetMetadata,
  useGraphOverlay,
  useHistoricValues,
  useLivePortfolio,
  useHistoricalGraph,
  useValenceAccount,
} from "@/app/rebalancer/ui";
import { Label, Line, ReferenceLine, Tooltip } from "recharts";
import {
  Scale,
  GraphKey,
  LOAD_CONFIG_ERROR,
  SymbolColors,
  GraphStyles,
} from "@/app/rebalancer/const";
import {
  scaleAtom,
  accountAtom,
  baseDenomAtom,
  priceSourceAtom,
} from "@/app/rebalancer/ui";
import { USDC_DENOM } from "@/const/chain-data";
import { createPortal } from "react-dom";
import { Overlay } from "@/components/Overlay";
import { StatusBar } from "@/components/StatusBar";
import { FiAlertTriangle } from "react-icons/fi";
import { FeatureFlags, useFeatureFlag } from "@/utils";
import { cn } from "@/utils";
import { useAtom } from "jotai";
import { useWallet } from "@/hooks";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";

export const HistoricalGraph: React.FC<{
  isError: boolean;
  isLoading: boolean;
}> = ({ isError, isLoading }) => {
  const [priceSource, setPriceSource] = useAtom(priceSourceAtom);

  const [scaleUrlParam, setScaleUrlParam] = useQueryState(
    "scale",
    parseAsStringEnum<Scale>(Object.values(Scale)).withDefault(Scale.Month),
  );
  const [scale, setScale] = useAtom(scaleAtom);
  useEffect(() => {
    setScale(scaleUrlParam);
  }, [setScale, scaleUrlParam]);

  const [account] = useAtom(accountAtom);
  const livePortfolioQuery = useLivePortfolio({
    accountAddress: account,
  });
  const accountConfigQuery = useAccountConfigQuery({
    account: account,
  });

  const targets = useMemo(
    () => accountConfigQuery.data?.targets ?? [],
    [accountConfigQuery.data?.targets],
  );

  const historicValuesQuery = useHistoricValues({
    accountAddress: account,
    targets,
  });

  const {
    data,
    isPending: isGraphPending,
    isLoading: isGraphLoading,
    isError: isGraphError,
    error: graphError,
  } = useHistoricalGraph({
    scale,
    rebalancerAddress: account,
    livePortfolio: livePortfolioQuery,
    config: accountConfigQuery,
    historicalValues: historicValuesQuery,
  });

  const [baseDenom, setBaseDenom] = useAtom(baseDenomAtom);

  const [baseDenomUrlParam, setBaseDenomUrlParam] = useQueryState("baseDenom", {
    defaultValue: USDC_DENOM,
  });

  useEffect(() => {
    setBaseDenom(baseDenomUrlParam);
  }, [baseDenomUrlParam, setBaseDenom]);

  const isNonUsdValueEnabled = useFeatureFlag(
    FeatureFlags.REBALANCER_NONUSDC_VALUE,
  );

  const isPriceSourceEnabled = useFeatureFlag(
    FeatureFlags.REBALANCE_PRICE_SOURCE_TOGGLE,
  );

  const [showTargets, setShowTargets] = useState(false);

  const graphRef = useRef<HTMLDivElement>(null);
  const { portalPosition, overlayRef } = useGraphOverlay(graphRef);

  const {
    address: walletAddress,
    isWalletConnected,
    isWalletConnecting,
  } = useWallet();
  // only to handle loading state when wallet is connected
  const valenceAccountQuery = useValenceAccount(walletAddress);

  const isHasAccountInput = !!account && account !== "";

  const { getOriginAsset } = useAssetMetadata();

  const GraphMessages = () => {
    if (!isHasAccountInput) {
      if (!isWalletConnected) {
        return <StatusBar variant="primary" text="Please enter an account" />;
      } else {
        // if no valence account
        if (
          valenceAccountQuery.isFetched &&
          !valenceAccountQuery?.data &&
          !isWalletConnecting
        ) {
          return <CreateAccountCTA />;
        }
        return <StatusBar variant="primary" text="Please enter an account" />;
      }
    } else if (
      isWalletConnecting ||
      valenceAccountQuery.isLoading ||
      isGraphLoading ||
      isGraphPending ||
      isLoading ||
      accountConfigQuery.isLoading ||
      livePortfolioQuery.isLoading ||
      historicValuesQuery.isLoading
    ) {
      return <StatusBar variant="loading" />;
    } else if (accountConfigQuery.isError || isGraphError) {
      if (isGraphError) {
        ErrorHandler.makeError(
          ERROR_MESSAGES.HISTORICAL_GRAPH_RENDER_ERROR,
          graphError,
        );
      }
      return accountConfigQuery.error === LOAD_CONFIG_ERROR.INVALID_ACCOUNT ? (
        <StatusBar
          variant="error"
          text="Invalid rebalancer account"
          icon={<FiAlertTriangle />}
        />
      ) : (
        <StatusBar
          variant="error"
          text="Could not fetch historical data"
          icon={<FiAlertTriangle />}
        />
      );
    } else if (historicValuesQuery.isError) {
      ErrorHandler.makeError(
        ERROR_MESSAGES.HISTORICAL_GRAPH_LOAD_ERROR,
        historicValuesQuery.error,
      );
      return (
        <StatusBar
          variant="error"
          text="Error loading historical data"
          icon={<FiAlertTriangle />}
        />
      );
    }
  };
  const tooltipKeys = !data?.keys
    ? []
    : [...data.keys.values, ...data.keys.projections];

  return (
    <>
      <div className="flex flex-row items-stretch justify-between border-b border-valence-black px-4 py-2">
        {isNonUsdValueEnabled && (
          <Dropdown
            options={VALUE_BASE_OPTIONS}
            selected={baseDenom}
            onSelected={setBaseDenomUrlParam}
          />
        )}

        <div className="flex  flex-row items-center gap-8 overflow-clip pr-2">
          {scales.map((thisScale) => (
            <div
              key={thisScale}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center text-base",
                isError || isLoading
                  ? "cursor-not-allowed text-valence-gray"
                  : "",
                scale === thisScale
                  ? "text-valence-black"
                  : "text-valence-gray",
              )}
              onClick={() => {
                if (!isError && !isLoading)
                  setScaleUrlParam(thisScale as Scale);
              }}
            >
              <p>1{thisScale.toUpperCase()}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-4">
          {isPriceSourceEnabled && (
            <button
              disabled={!data?.graphData.length}
              className={cn(
                "text-nowrap text-sm",
                !data?.graphData.length &&
                  "cursor-not-allowed  text-valence-gray",
              )}
              onClick={() => {
                setPriceSource(
                  priceSource === "oracle" ? "coingecko" : "oracle",
                );
              }}
            >
              {priceSource === "oracle"
                ? "Price source: Oracle"
                : "Price Source: CoinGecko"}
            </button>
          )}

          <button
            disabled={!data?.graphData.length}
            className={cn(
              "text-nowrap text-sm",
              !data?.graphData.length &&
                "cursor-not-allowed  text-valence-gray",
            )}
            onClick={() => setShowTargets(!showTargets)}
          >
            {showTargets ? "Hide Targets" : "Show Targets"}
          </button>
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
        xAxisTicks={data?.xAxisTicks ?? []}
        yAxisTicks={data?.yAxisTicks ?? []}
        data={data?.graphData ?? []}
      >
        <Tooltip content={<ValueTooltip keys={tooltipKeys} />} />

        {!isLoading &&
          accountConfigQuery?.data?.targets.map((target) => {
            const asset = getOriginAsset(target.denom);
            const assetSymbol = asset?.symbol ?? "";
            const historicalValue = GraphKey.historicalValue(assetSymbol);
            const projectedValue = GraphKey.projectedValue(assetSymbol);
            const historicalTarget =
              GraphKey.historicalTargetValue(assetSymbol);
            const projectedTarget = GraphKey.projectedTargetValue(assetSymbol);
            return (
              <Fragment key={`line-${target.denom}`}>
                <ReferenceLine
                  key={`label-target-${target.denom}`}
                  x={data?.todayTimestamp}
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
                  stroke={SymbolColors.get(assetSymbol)}
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
                      stroke={SymbolColors.get(assetSymbol)}
                      strokeWidth={GraphStyles.width.thin}
                      isAnimationActive={false}
                      strokeDasharray={GraphStyles.lineStyle.solid}
                    />
                    <Line
                      dataKey={projectedTarget}
                      type="monotone"
                      dot={false}
                      activeDot={false}
                      stroke={SymbolColors.get(assetSymbol)}
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
                  stroke={SymbolColors.get(assetSymbol)}
                  isAnimationActive={false}
                  strokeWidth={GraphStyles.width.regular}
                  strokeDasharray={GraphStyles.lineStyle.dotted}
                />
              </Fragment>
            );
          })}
      </Graph>
    </>
  );
};

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
