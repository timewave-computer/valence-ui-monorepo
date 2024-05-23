import {
  Scale,
  scaleTickCount,
  scaleIntervalSeconds,
  GraphKey,
  KeyTag,
  minimumTimestampGenerator,
  projectionLength,
  yTickCount,
} from "@/app/rebalancer/const/graph";
import {
  FetchAccountConfigReturnValue,
  FetchHistoricalValuesReturnValue,
} from "@/server/actions";
import { baseToUnit, simulate } from "@/utils";
import { useMemo } from "react";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { UTCDate } from "@date-fns/utc";
import { addDays } from "date-fns";
import type { GraphData } from "@/app/rebalancer/components/graph";

type HistoricalValueGraphProps = {
  config?: FetchAccountConfigReturnValue;
  data?: FetchHistoricalValuesReturnValue["values"];
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
}: HistoricalValueGraphProps): HistoricalValueGraphReturnValue => {
  const [scale, setScale] = useQueryState(
    "scale",
    parseAsStringEnum<Scale>(Object.values(Scale)).withDefault(Scale.Year),
  );
  const keysToGraph = useMemo(() => {
    let result: string[] = [];
    config?.targets?.forEach((target) => {
      result.push(GraphKey.value(target.asset.name));
      result.push(GraphKey.projectedValue(target.asset.name));
    });
    return result;
  }, [config?.targets]);

  const minTimestamp = useMemo(() => {
    let ts: number;
    // if no data yet, use current time so some ticks render by default
    if (!rawData || !rawData.length) {
      ts = new UTCDate().getTime();
    } else {
      const mostRecentEntry = rawData[rawData.length - 1];
      ts = mostRecentEntry.timestamp;
    }

    return minimumTimestampGenerator[scale](ts);
  }, [scale, rawData]);

  const xAxisTicks = useMemo(() => {
    if (!minTimestamp) return [];
    const tickCount = scaleTickCount[scale];
    const tickInterval = scaleIntervalSeconds[scale] * 1000;

    return new Array(tickCount).fill(0).map((_, i) => {
      const timestamp = new UTCDate(minTimestamp + tickInterval * i);
      if (scale === Scale.Year) {
        timestamp.setMonth(timestamp.getMonth() + 1); // don't show tick for incomplete first month
        timestamp.setDate(1);
        timestamp.setHours(0, 0, 0, 0);
      } else if (scale === Scale.Month || scale === Scale.Week) {
        timestamp.setHours(0, 0, 0, 0);
      }
      return timestamp.getTime();
    });
  }, [scale, minTimestamp]);

  const data = useMemo(() => {
    if (!minTimestamp) return [];
    return rawData?.filter((d) => d.timestamp >= minTimestamp);
  }, [rawData, minTimestamp]);

  const dataFormatted: GraphData = useMemo(() => {
    if (!data) return [];

    return data.map((historicalValue) => {
      const restOfKeys: { [key: string]: number } = {};
      historicalValue.tokens.forEach((token) => {
        const asset = config?.targets.find(
          (target) => target.denom === token.denom,
        )?.asset;
        if (!asset) return; // should not happen but just in case
        const amount = baseToUnit(token.amount, asset.decimals);
        restOfKeys[GraphKey.balance(asset.name)] = amount;
        restOfKeys[GraphKey.value(asset.name)] = amount * token.price;
      });
      return {
        timestamp: historicalValue.timestamp,
        ...restOfKeys,
      };
    });
  }, [data]);

  const projectionsFormatted = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!config?.pid || !config?.targets || !config?.targets.length) return [];
    const latest = data[data.length - 1];

    const simulationInput = latest.tokens.map((token) => {
      const targetConfig = config.targets.find(
        (target) => target.denom === token.denom,
      );
      return {
        amount: token.amount,
        price: token.price,
        target: targetConfig?.percent ?? 0,
      };
    });

    const { kp, ki, kd } = config.pid;
    const projections = simulate(
      kp,
      ki,
      kd,
      projectionLength[scale],
      simulationInput,
    );

    return projections.map((tokenAmounts, i) => {
      let ts = new UTCDate();
      ts.setHours(0, 0, 0, 0);
      ts = addDays(ts, i);

      return {
        timestamp: ts.getTime(),
        ...latest.tokens.reduce(
          (acc, { denom, price }, i) => {
            const asset = config?.targets.find(
              (target) => target.denom === denom,
            )?.asset;
            if (!asset) return acc; // should not happen but just in case
            const amount = baseToUnit(tokenAmounts[i], asset.decimals);
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
  }, [scale, data, config?.targets, config?.pid]);

  const allData: GraphData = useMemo(() => {
    const allData = [...dataFormatted, ...projectionsFormatted];
    return allData;
  }, [dataFormatted, projectionsFormatted]);

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

    // adds extra space on top
    return new Array(yTickCount + 1).fill(0).map((_, i) => {
      return yMin + yTickInterval * i;
    });
  }, [allData, keysToGraph]);

  const todayTimestamp = useMemo(() => {
    const date = new UTCDate();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }, []);

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
