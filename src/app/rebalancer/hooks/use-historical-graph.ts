import {
  Scale,
  GraphKey,
  KeyTag,
  projectionLength,
  yTickCount,
  dayCountForScale,
  minTimestampGenerator,
} from "@/app/rebalancer/const/graph";
import {
  FetchAccountConfigReturnValue,
  FetchHistoricalValuesReturnValue,
  FetchLivePortfolioReturnValue,
} from "@/server/actions";
import { simulate } from "@/utils";
import { useMemo } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { UTCDate } from "@date-fns/utc";
import { addDays } from "date-fns";
import type { GraphData } from "@/app/rebalancer/components/graph";
import { useAtom } from "jotai";
import { localTimeAtom } from "@/ui-globals";

type HistoricalValueGraphProps = {
  config?: FetchAccountConfigReturnValue;
  data?: FetchHistoricalValuesReturnValue["values"];
  livePortfolio?: FetchLivePortfolioReturnValue["portfolio"];
};

/***
 * Data is fetched for last 365 days by default
 * Based on the scale (W,M,Y), we filter data by minimum timestamp, generate x axis ticks, and massage data into format digestible by the graph
 * We generate projections with last historic price for a time period ahead
 *
 */
export const useHistoricalValueGraph = ({
  data: rawData,
  config,
  livePortfolio,
}: HistoricalValueGraphProps): HistoricalValueGraphReturnValue => {
  const [scale, setScale] = useQueryState(
    "scale",
    parseAsStringEnum<Scale>(Object.values(Scale)).withDefault(Scale.Month),
  );
  const [localTime] = useAtom(localTimeAtom);

  const keysToGraph = useMemo(() => {
    let result: string[] = [];
    config?.targets?.forEach((target) => {
      result.push(GraphKey.value(target.asset.name));
      result.push(GraphKey.projectedValue(target.asset.name));
    });
    return result;
  }, [config?.targets]);

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

  const todayTimestamp = useMemo(() => {
    return new UTCDate(localTime.now).getTime();
  }, [localTime.now]);

  const data = useMemo(() => {
    if (!minTimestamp || !rawData) return [];
    const filtered = rawData?.filter((d) => d.timestamp >= minTimestamp);

    // pad data with current 'Today' timestamp
    // if live portfolio, use that, use last data point
    let lastItem = filtered[filtered.length - 1];
    if (livePortfolio) {
      lastItem = {
        timestamp: todayTimestamp,
        readableDate: new UTCDate(todayTimestamp).toISOString(),
        tokens: livePortfolio.map((balance) => {
          return {
            denom: balance.denom,
            amount: balance.amount,
            price: balance.price,
          };
        }),
      };
      filtered.push(lastItem);
    }
    return filtered;
  }, [rawData, livePortfolio, todayTimestamp, minTimestamp]);

  const historicalGraphData: GraphData = useMemo(() => {
    return data.map((graphDataPoint) => {
      const restOfKeys: { [key: string]: number } = {};
      config?.targets.forEach((target) => {
        const value = graphDataPoint.tokens.find(
          (t) => t.denom === target.denom,
        );
        if (!value) {
          // should not happen but handle it just in case
          return;
        }
        restOfKeys[GraphKey.balance(target.asset.name)] = value.amount;
        restOfKeys[GraphKey.value(target.asset.name)] =
          value.amount * value.price;
      });

      return {
        timestamp: graphDataPoint.timestamp,
        ...restOfKeys,
      };
    });
  }, [data, config?.targets]);

  const projectionsGraphData = useMemo(() => {
    if (data.length === 0) return [];
    if (!config?.pid || !config?.targets || !config?.targets.length) return [];
    let latest = data[data.length - 1].tokens;

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

    const projectionTimestampStart = localTime.now;

    return projections.map((tokenAmounts, i) => {
      let ts = addDays(projectionTimestampStart, i);
      if (i > 0) ts.setHours(0, 0, 0, 0);

      return {
        timestamp: ts.getTime(),
        ...latest.reduce(
          (acc, { denom, price }, i) => {
            const asset = config?.targets.find(
              (target) => target.denom === denom,
            )?.asset;
            if (!asset) return acc; // should not happen but just in case
            const amount = Number(tokenAmounts[i].toFixed(6));
            return {
              ...acc,
              [GraphKey.projectedValue(asset.name)]: amount * price,
              [GraphKey.projectedAmount(asset.name)]: amount,
            };
          },
          {} as Record<string, number>,
        ),
      };
    });
  }, [
    localTime.now,
    todayTimestamp,
    scale,
    data,
    config?.targets,
    config?.pid,
  ]);

  const allData: GraphData = useMemo(() => {
    const allData = [...historicalGraphData, ...projectionsGraphData];
    return allData;
  }, [historicalGraphData, projectionsGraphData]);

  /***
   * Extract timestamps from data to generate ticks (data is already on a specific scale)
   * for yearly, generate tick for first of each month
   * for rest (weekly, monthly), generate tick for each day
   */
  const xAxisTicks: number[] = useMemo(() => {
    if (scale === Scale.Year) {
      let lastMonth: number;
      const monthTicks = allData
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
      if (monthTicks.length < 15) {
        // Calculate the number of months to add
        const monthsToAdd = 15 - monthTicks.length;

        // Get the first month in the array
        const firstMonth = monthTicks[0];

        // Add the necessary number of months to the start of the array
        for (let i = 0; i < monthsToAdd; i++) {
          const newMonth = new UTCDate(firstMonth);
          newMonth.setUTCMonth(newMonth.getUTCMonth() - (i + 1));
          monthTicks.unshift(newMonth.getTime());
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
    todayTimestamp,
    graphData: allData,
    keys: {
      projections: keysToGraph.filter((k) => k.includes(KeyTag.projectedValue)),
      values: keysToGraph.filter((k) => k.includes(KeyTag.value)),
    },
    xAxisTicks,
    yAxisTicks,
    scale,
    setScale,
  };
};

type HistoricalValueGraphReturnValue = {
  todayTimestamp: number;
  graphData: GraphData;
  xAxisTicks: number[];
  yAxisTicks: number[];
  scale: Scale;
  keys: {
    projections: string[];
    values: string[];
  };
  setScale: (s: Scale) => void;
};
