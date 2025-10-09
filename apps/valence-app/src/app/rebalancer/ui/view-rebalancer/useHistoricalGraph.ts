import {
  Scale,
  GraphKey,
  KeyTag,
  historicalYTickCount,
  scaleTickCount,
  dataPointCount,
  xTickGenerator,
  maxHistoryDataPoints,
  minTimestampGenerator,
  type GraphData,
  priceSourceAtom,
  useAssetMetadata,
  type UseLivePortfolioReturnValue,
  type UseHistoricalValuesReturnValue,
  type UseAccountConfigQueryReturnValue,
} from "@/app/rebalancer/ui";
import {
  type FetchAccountConfigReturnValue,
  type FetchHistoricalValuesReturnValue,
} from "@/server/actions";
import { simulate } from "@/utils";
import { UTCDate } from "@date-fns/utc";
import { addDays, subDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { OriginAsset } from "@/types/ibc";
import { IndexerHistoricalTargetsResponse } from "@/types/rebalancer";
import { useAtom } from "jotai";

export const useHistoricalGraph = ({
  scale = Scale.Month,
  rebalancerAddress,
  config,
  livePortfolio,
  historicalValues,
}: {
  scale?: Scale;
  rebalancerAddress?: string;
  config: UseAccountConfigQueryReturnValue;
  livePortfolio: UseLivePortfolioReturnValue;
  historicalValues: UseHistoricalValuesReturnValue;
}) => {
  const { getOriginAsset } = useAssetMetadata();
  const [priceSource] = useAtom(priceSourceAtom);
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      QUERY_KEYS.HISTORICAL_GRAPH,
      scale,
      rebalancerAddress,
      config,
      livePortfolio,
      historicalValues?.data?.length,
      priceSource,
    ],
    retry: false,
    enabled:
      !config.isLoading &&
      !livePortfolio.isLoading &&
      !!livePortfolio.data &&
      !!historicalValues.data &&
      !historicalValues.isLoading &&
      !!rebalancerAddress,
    queryFn: () => {
      const _keysToGraph = config.data?.targets?.reduce(
        (acc: string[], target) => {
          const asset = getOriginAsset(target.denom);
          const assetSymbol = asset?.symbol ?? "";
          acc.push(GraphKey.historicalValue(assetSymbol));
          acc.push(GraphKey.projectedValue(assetSymbol));
          acc.push(GraphKey.historicalTargetValue(assetSymbol));
          return acc;
        },
        [],
      );
      const keysToGraph = _keysToGraph?.length ? _keysToGraph : [];

      const minTimestamp = getMinTimestamp({
        rawData: historicalValues.data,
        scale,
      });

      const localTimeNow = new UTCDate(new Date()).getTime();

      // filters, formats, appends todays value
      const data = convertData({
        minTimestamp,

        rawData: historicalValues.data,
      });
      const todaysDataPoint = makeTodaysDataPoint({
        livePortfolio: livePortfolio.data,
        localTimeNow,
      });
      data.push(todaysDataPoint);

      const historialGraphData = generateHistoricalGraphData({
        data,
        config: config?.data,
        getOriginAsset,
        historicalTargets: historicalValues.historicTargets,
      });

      const projectedGraphData = generateProjectedData({
        latest: todaysDataPoint,
        getOriginAsset,
        config: config?.data,
        scale,
      });
      const allData = projectedGraphData.length
        ? [...historialGraphData, ...projectedGraphData].slice(
            0,
            dataPointCount[scale] + 1,
          ) // we generate a larger projection, trim off what we dont need
        : [];

      const yAxisTicks = generateYAxisTicks({
        data: allData,
        scale,
        keysToGraph: keysToGraph,
      });

      const xAxisTicks = generateXAxisTicksV2({
        data: allData,
        scale,
        keysToGraph: keysToGraph,
      });

      return {
        todayTimestamp: localTimeNow,
        graphData: allData,
        keys: {
          projections: keysToGraph.filter((k) =>
            k.includes(KeyTag.projectedValue),
          ),
          values: keysToGraph.filter((k) => k.includes(KeyTag.historicalValue)),
        },
        xAxisTicks,
        yAxisTicks,
      };
    },
  });
};

const getMinTimestamp = ({
  rawData,
  scale,
}: {
  rawData?: FetchHistoricalValuesReturnValue["values"];
  scale: Scale;
}) => {
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
  const dayCount = maxHistoryDataPoints[scale];
  // handle if data is smaller than the graph window
  if (dataSize < dayCount) return minTimestampGenerator(ts, dayCount);
  // otherwise, return the first timestamp within the window
  else return rawData[Math.max(0, dataSize - dayCount)]?.timestamp;
};

const makeTodaysDataPoint = ({
  livePortfolio,
  localTimeNow,
}: {
  livePortfolio: UseLivePortfolioReturnValue["data"];
  localTimeNow: number;
}): FetchHistoricalValuesReturnValue["values"][number] => {
  return {
    timestamp: localTimeNow,
    readableDate: new UTCDate(localTimeNow).toISOString(),
    tokens: livePortfolio.balances.map((lineItem) => {
      return {
        denom: lineItem.denom,
        amount: lineItem.balance.total,
        price: lineItem.price,
      };
    }),
  };
};

const convertData = ({
  minTimestamp,
  rawData,
}: {
  minTimestamp: number;
  rawData?: FetchHistoricalValuesReturnValue["values"];
}): FetchHistoricalValuesReturnValue["values"] => {
  if (!minTimestamp || !rawData) return [];
  return rawData?.filter((d) => d.timestamp >= minTimestamp);
};

const generateHistoricalGraphData = ({
  data,
  config,
  getOriginAsset,
  historicalTargets,
}: {
  data: FetchHistoricalValuesReturnValue["values"];
  config?: FetchAccountConfigReturnValue;
  getOriginAsset: (s: string) => OriginAsset | undefined;
  historicalTargets?: FetchHistoricalValuesReturnValue["historicalTargets"];
}): GraphData => {
  const historialGraphData = data.map((graphDataPoint) => {
    const balances: { [key: string]: number } = {};
    const values: { [key: string]: number } = {};
    const targetValues: { [key: string]: number } = {};
    const prices: { [key: string]: number } = {};
    config?.targets.forEach((target) => {
      let value = graphDataPoint.tokens.find((t) => t.denom === target.denom);
      if (!value) {
        // should not happen but handle it just in case
        return;
      }
      const asset = getOriginAsset(target.denom);
      const assetSymbol = asset?.symbol ?? "";

      // write target value for each asset
      prices[GraphKey.price(assetSymbol)] = value.price;
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
        const assetSymbol = getOriginAsset(target.denom)?.symbol ?? "";
        targetValues[GraphKey.historicalTargetValue(assetSymbol)] =
          totalValue * percentage;
      }
    });
    return {
      timestamp: graphDataPoint.timestamp,
      ...values,
      ...balances,
      ...targetValues,
      ...prices,
    };
  });
  return historialGraphData;
};

const generateProjectedData = ({
  latest,
  config,
  scale,
  getOriginAsset,
}: {
  latest: FetchHistoricalValuesReturnValue["values"][number];
  config?: FetchAccountConfigReturnValue;
  scale: Scale;
  getOriginAsset: (s: string) => OriginAsset | undefined;
}) => {
  if (!config) return [];

  const lastTotalValue = latest.tokens.reduce((acc, { amount, price }) => {
    return acc + amount * price;
  }, 0);

  const simulationInput = latest.tokens.map((balance) => {
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
    dataPointCount[scale], // generate most data points in case there is no history
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
      ...latest.tokens.reduce(
        (acc, { denom, price }, i) => {
          const target = config?.targets.find(
            (target) => target.denom === denom,
          );
          if (!target) return acc; // should not happen but just in case
          const amount = Number(tokenAmounts[i].toFixed(6));
          const assetSymbol = getOriginAsset(target.denom)?.symbol ?? "";

          return {
            ...acc,
            [GraphKey.price(assetSymbol)]: price,
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
};

const generateXAxisTicks = ({
  data,
  scale,
}: {
  data: GraphData;
  scale: Scale;
}) => {
  if (scale === Scale.Year) {
    let lastMonth: number;
    const yearTicks = data
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
    const monthTicks = data
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
  } else if (scale === Scale.Week) {
    // we can only have 20 ticks
    const dayTicks = data.map((t) => {
      return t.timestamp;
    });
    // work backwards and pad array
    if (dayTicks.length < scaleTickCount[Scale.Week]) {
      const first = dayTicks[0];
      const ticksToAdd = scaleTickCount[Scale.Week] - dayTicks.length;
      console;

      for (let i = 1; i < ticksToAdd; i++) {
        const newDate = subDays(new UTCDate(first), i);
        dayTicks.unshift(newDate.getTime());
      }
    }
    return dayTicks;
  } else {
    // should not happen but just in case
    return data.map((t) => {
      return t.timestamp;
    });
  }
};

const generateXAxisTicksV2 = ({
  data,
  scale,
  keysToGraph,
}: {
  data: GraphData;
  scale: Scale;
  keysToGraph: string[];
}) => {
  const minTimestamp = data[0].timestamp;
  const minDate = new UTCDate(minTimestamp).setHours(0, 0, 0, 0);
  const startTs = new UTCDate(minDate);
  const ticks = xTickGenerator[scale](startTs);
  return ticks;
};

const generateYAxisTicks = ({
  data,
  scale,
  keysToGraph,
}: {
  data: GraphData;
  scale: Scale;
  keysToGraph: string[];
}) => {
  if (!data || !data.length)
    return new Array(historicalYTickCount).fill(0).map((_, i) => {
      return 5000 * i;
    });

  let yMax = 0;
  let yMin = 0;

  data.forEach((d) => {
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
  const yTickInterval = yRange / historicalYTickCount;

  // the +1 adds extra space on top
  return new Array(historicalYTickCount + 1).fill(0).map((_, i) => {
    return yMin + yTickInterval * i;
  });
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
