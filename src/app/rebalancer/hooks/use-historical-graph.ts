import {
  Scale,
  scaleTickCount,
  scaleIntervalSeconds,
  GraphKey,
  KeyTag,
  minimumTimestampGenerator,
  projectionLength,
} from "@/app/rebalancer/const/graph";
import {
  FetchHistoricalValuesReturnValue,
  ValenceAccountConfig,
} from "@/server/actions";
import { simulate } from "@/utils";
import { useMemo } from "react";
import { GraphData } from "@/app/rebalancer/components/graph";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { UTCDate } from "@date-fns/utc";
import { set, addDays } from "date-fns";

type HistoricalValueGraphProps = {
  config?: ValenceAccountConfig;
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
  const keys = useMemo(() => {
    const targetDenoms = config?.targets?.map((t) => t.denom) ?? [];
    let result: string[] = [];
    targetDenoms.forEach((denom) => {
      result.push(GraphKey.value(denom));
      result.push(GraphKey.projectedValue(denom));
    });
    return result;
  }, [config]);

  const minTimestamp = useMemo(() => {
    if (!rawData || !rawData.length) return;
    const mostRecentEntry = rawData[rawData.length - 1];
    return minimumTimestampGenerator[scale](mostRecentEntry.timestamp);
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
        restOfKeys[GraphKey.balance(token.denom)] = token.amount;
        restOfKeys[GraphKey.value(token.denom)] = token.amount * token.price;
      });
      return {
        timestamp: historicalValue.timestamp,
        ...restOfKeys,
      };
    });
  }, [data]);

  const projectionsFormatted = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!config?.pid) return [];
    const latest = data[data.length - 1];

    const simulationInput = latest.tokens.map((token) => {
      const targetConfig = config?.targets.find(
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
          (acc, { denom, price }, i) => ({
            ...acc,
            [GraphKey.projectedValue(denom)]: tokenAmounts[i] * price,
            [GraphKey.projectedAmount(denom)]: tokenAmounts[i] * price,
          }),
          {} as Record<string, number>,
        ),
      };
    });
  }, [scale, data, config]);

  const allData: GraphData = useMemo(() => {
    const allData = [...dataFormatted, ...projectionsFormatted];
    return allData;
  }, [dataFormatted, projectionsFormatted]);

  const todayTimestamp = useMemo(() => {
    const date = new UTCDate();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }, []);

  return {
    todayTimestamp,
    graphData: allData,
    keys: {
      projections: keys.filter((k) => k.includes(KeyTag.projectedValue)),
      values: keys.filter((k) => k.includes(KeyTag.value)),
    },
    xAxisTicks,
    scale,
    setScale,
  };
};

type HistoricalValueGraphReturnValue = {
  todayTimestamp: number;
  graphData: GraphData;
  xAxisTicks: number[];
  scale: Scale;
  keys: {
    projections: string[];
    values: string[];
  };
  setScale: (s: Scale) => void;
};
