import {
  Scale,
  GraphKey,
  KeyTag,
  projectionLength,
  yTickCount,
  dayCountForScale,
  minTimestampGenerator,
  scaleTickCount,
} from "@/app/rebalancer/const/graph";
import {
  FetchAccountConfigReturnValue,
  FetchHistoricalValuesReturnValue,
} from "@/server/actions";
import { simulate } from "@/utils";
import { useMemo } from "react";
import { UTCDate } from "@date-fns/utc";
import { addDays, subDays } from "date-fns";
import type { GraphData } from "@/app/rebalancer/components/graph";
import { IndexerHistoricalTargetsResponse } from "@/types/rebalancer";
import { useAssetCache } from "./use-cached-data";
import { UseLivePortfolioReturnValue } from "./use-live-portfolio";

type HistoricalValueGraphProps = {
  config?: FetchAccountConfigReturnValue;
  data?: FetchHistoricalValuesReturnValue["values"];
  livePortfolio?: UseLivePortfolioReturnValue["data"];
  historicalTargets?: FetchHistoricalValuesReturnValue["historicalTargets"];
  scale?: Scale;
  isLoading: boolean;
};

export const useHistoricalValueGraph = ({
  isLoading,
  data: rawData,
  config,
  livePortfolio,
  historicalTargets,
  scale = Scale.Month,
}: HistoricalValueGraphProps): HistoricalValueGraphReturnValue => {
  const { getAsset } = useAssetCache();

  const keysToGraph = useMemo(() => {
    let result: string[] = [];

    config?.targets?.forEach((target) => {
      const asset = getAsset(target.denom);
      const assetSymbol = asset?.symbol ?? "";
      result.push(GraphKey.historicalValue(assetSymbol));
      result.push(GraphKey.projectedValue(assetSymbol));
      result.push(GraphKey.historicalTargetValue(assetSymbol));
    });
    return result;
  }, [getAsset, config?.targets]);

  const minTimestamp = useMemo(() => {
    // based on scale, select from certain index
    if (!rawData || !rawData.length) return new UTCDate().getTime();

    let ts: number;
    // if no data yet, use current time so some ticks render by default
    if (!rawData || !rawData.length) {
      ts = new UTCDate().getTime();
    } else {
      const mostRecentEntry = rawData[rawData.length - 1];
      ts = mostRecentEntry.timestamp;
    }

    const dataSize = rawData.length;
    const dayCount = dayCountForScale[scale];
    // handle if data is smaller than the graph window
    if (dataSize < dayCount) return minTimestampGenerator(ts, dayCount);
    // otherwise, return the first timestamp within the window
    else return rawData[Math.max(0, dataSize - dayCount)]?.timestamp;
  }, [scale, rawData]);

  const localTimeNow = new UTCDate(new Date()).getTime();

  const data = useMemo(() => {
    if (!minTimestamp || !rawData) return [];
    const filtered = rawData?.filter((d) => d.timestamp >= minTimestamp);

    // pad data with current 'Today' timestamp
    // if live portfolio, use that, use last data point
    let lastItem = filtered[filtered.length - 1];
    if (livePortfolio && filtered.length > 0) {
      lastItem = {
        timestamp: localTimeNow,
        readableDate: new UTCDate(localTimeNow).toISOString(),
        tokens: livePortfolio.map((lineItem) => {
          return {
            denom: lineItem.denom,
            amount: lineItem.balance.total,
            price: lineItem.price,
          };
        }),
      };
      filtered.push(lastItem);
    }
    return filtered;
  }, [rawData, livePortfolio, localTimeNow, minTimestamp]);

  const historicalGraphData: GraphData = useMemo(() => {
    const historialGraphData = data.map((graphDataPoint) => {
      const balances: { [key: string]: number } = {};
      const values: { [key: string]: number } = {};
      const targetValues: { [key: string]: number } = {};
      config?.targets.forEach((target) => {
        const value = graphDataPoint.tokens.find(
          (t) => t.denom === target.denom,
        );
        if (!value) {
          // should not happen but handle it just in case
          return;
        }
        const asset = getAsset(target.denom);
        const assetSymbol = asset?.symbol ?? "";

        // write target value for each asset
        balances[GraphKey.historicalAmount(assetSymbol)] = value.amount;
        values[GraphKey.historicalValue(assetSymbol)] =
          value.amount * value.price;
      });

      const totalValue = Object.values(values)?.reduce((acc, value: number) => {
        return acc + value;
      }, 0);

      let historicalTargetsForTimestamp = findClosestHistoricalTargetsTimestamp(
        graphDataPoint.timestamp,
        historicalTargets,
      );

      config?.targets.forEach((target) => {
        const percentage = Number(
          historicalTargetsForTimestamp?.find((t) => t.denom === target.denom)
            ?.percentage,
        );
        if (percentage) {
          const assetSymbol = getAsset(target.denom)?.symbol ?? "";
          targetValues[GraphKey.historicalTargetValue(assetSymbol)] =
            totalValue * percentage;
        }
      });
      return {
        timestamp: graphDataPoint.timestamp,
        ...values,
        ...balances,
        ...targetValues,
      };
    });
    return historialGraphData;
  }, [getAsset, data, historicalTargets, config?.targets]);

  const projectionsGraphData = useMemo(() => {
    if (data.length === 0 || isLoading) return [];
    if (!config?.pid || !config?.targets || !config?.targets.length) return [];
    let latest = data[data.length - 1].tokens;
    const lastTotalValue = latest.reduce((acc, { amount, price }) => {
      return acc + amount * price;
    }, 0);

    // TODO: longer term there should be some dep array
    const simulationInput = latest.map((balance) => {
      const targetConfig = config.targets.find(
        (target) => target.denom === balance.denom,
      );
      return {
        amount: balance.amount,
        price: balance.price,
        target: targetConfig?.percentage ?? 0,
      };
    });

    const { p, i, d } = config.pid;
    const projections = simulate(
      p,
      i,
      d,
      projectionLength[scale],
      simulationInput,
    );

    const utcMidnight = new UTCDate().setHours(0, 0, 0, 0);

    let ts: number;
    return projections.map((tokenAmounts, i) => {
      // first point is 'right now today',showing current amounts, technically not a projection
      if (i === 0) {
        const now = new Date();
        ts = new UTCDate(now).getTime();
      }
      if (i > 0) {
        // tick by UTC midnight
        ts = addDays(utcMidnight, i).getTime();
      }

      return {
        timestamp: ts,
        ...latest.reduce(
          (acc, { denom, price }, i) => {
            const target = config?.targets.find(
              (target) => target.denom === denom,
            );
            if (!target) return acc; // should not happen but just in case
            const amount = Number(tokenAmounts[i].toFixed(6));
            const assetSymbol = getAsset(target.denom)?.symbol ?? "";

            return {
              ...acc,
              [GraphKey.projectedValue(assetSymbol)]: amount * price,
              [GraphKey.projectedAmount(assetSymbol)]: amount,
              [GraphKey.projectedTargetValue(assetSymbol)]:
                lastTotalValue * target.percentage,
            };
          },
          {} as Record<string, number>,
        ),
      };
    });
  }, [getAsset, isLoading, scale, data, config?.targets, config?.pid]);

  const allData: GraphData = useMemo(() => {
    if (!projectionsGraphData.length) return [];
    else return [...historicalGraphData, ...projectionsGraphData];
  }, [historicalGraphData, projectionsGraphData]);

  /***
   * Extract timestamps from data to generate ticks (data is already on a specific scale)
   * for yearly, generate tick for first of each month
   * for rest (weekly, monthly), generate tick for each day
   */
  const xAxisTicks: number[] = useMemo(() => {
    if (scale === Scale.Year) {
      let lastMonth: number;
      const yearTicks = allData
        .filter((t) => {
          const ts = new UTCDate(t.timestamp);
          const month = ts.getUTCMonth();
          if (month !== lastMonth) {
            lastMonth = month;
            return true;
          }
          return false;
        })
        .map((t) => {
          const ts = new UTCDate(t.timestamp);
          ts.setUTCDate(1);
          return ts.getTime();
        });

      // Check if the length of the months array is less than 15
      if (yearTicks.length < scaleTickCount[Scale.Year]) {
        // Calculate the number of months to add
        const monthsToAdd = 15 - yearTicks.length;

        // Get the first month in the array
        const firstMonth = yearTicks[0];

        // Add the necessary number of months to the start of the array
        for (let i = 0; i < monthsToAdd; i++) {
          const newMonth = new UTCDate(firstMonth);
          newMonth.setUTCMonth(newMonth.getUTCMonth() - (i + 1));
          yearTicks.unshift(newMonth.getTime());
        }
      }
      return yearTicks;
    } else if (scale === Scale.Month) {
      // we can only have 20 ticks
      const monthTicks = allData
        .filter((_, index) => index % 2 === 0)
        .map((t) => {
          return t.timestamp;
        });
      // work backwards and pad array with every other day from the last date
      if (monthTicks.length < scaleTickCount[Scale.Month]) {
        const first = monthTicks[0];
        const ticksToAdd = scaleTickCount[Scale.Month] - monthTicks.length;
        console;

        for (let i = 1; i < ticksToAdd; i++) {
          const newDate = subDays(new UTCDate(first), i * 2);
          monthTicks.unshift(newDate.getTime());
        }
      }
      return monthTicks;
    } else {
      return allData.map((t) => {
        return t.timestamp;
      });
    }
  }, [allData, scale]);

  const yAxisTicks = useMemo(() => {
    if (!allData || !allData.length)
      return new Array(yTickCount).fill(0).map((_, i) => {
        return 5000 * i;
      });

    let yMax = 0;
    let yMin = 0;

    allData.forEach((d) => {
      const dItems = Object.entries(d);
      const graphedYValues = dItems
        .filter(([key, value]) => keysToGraph.includes(key))
        .map(([key, value]) => value);

      const localMax = Math.max(...graphedYValues);
      const localMin = Math.min(...graphedYValues);
      yMax = Math.max(yMax, localMax);
      yMin = Math.min(yMin, localMin);
    });

    const yRange = yMax - yMin;
    const yTickInterval = yRange / yTickCount;

    // the +1 adds extra space on top
    return new Array(yTickCount + 1).fill(0).map((_, i) => {
      return yMin + yTickInterval * i;
    });
  }, [allData, keysToGraph]);

  return {
    todayTimestamp: localTimeNow,
    graphData: allData,
    keys: {
      projections: keysToGraph.filter((k) => k.includes(KeyTag.projectedValue)),
      values: keysToGraph.filter((k) => k.includes(KeyTag.historicalValue)),
    },
    xAxisTicks,
    yAxisTicks,
  };
};

type HistoricalValueGraphReturnValue = {
  todayTimestamp: number;
  graphData: GraphData;
  xAxisTicks: number[];
  yAxisTicks: number[];
  keys: {
    projections: string[];
    values: string[];
  };
};

export function findClosestHistoricalTargetsTimestamp(
  balanceTimestamp: number,
  historicalTargets?: IndexerHistoricalTargetsResponse,
): IndexerHistoricalTargetsResponse[number]["value"] | null {
  if (!historicalTargets || historicalTargets.length === 0) {
    return null;
  }

  let closest = historicalTargets[0];
  let smallestDiff = Math.abs(
    balanceTimestamp - Number(historicalTargets[0].at),
  );

  for (let i = 1; i < historicalTargets.length; i++) {
    const diff = Math.abs(balanceTimestamp - Number(historicalTargets[i].at));
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closest = historicalTargets[i];
    }
  }

  return closest.value;
}
