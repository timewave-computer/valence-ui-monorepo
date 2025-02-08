"use server";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { CACHE_KEYS, fetchMaybeCached } from "@/server/utils";
import { IndexerHistoricalTargetsResponse } from "@/types/rebalancer";
import {
  CoinGeckoHistoricPrices,
  CoinGeckoHistoricPricesSchema,
} from "@/types/coingecko";

import { secondsToHours, secondsToMinutes } from "date-fns";

enum TimeRange {
  Year = "year",
  Month = "month",
  Week = "week",
  Day = "day",
  Hour = "hour",
}

/**
 * Test whether or not a string is a valid time range.
 */
const isValidTimeRange = (range: string): range is TimeRange =>
  Object.values(TimeRange).includes(range as TimeRange);

// The duration in seconds of a given range.
const rangeDuration: Record<TimeRange, number> = {
  [TimeRange.Year]: 365 * 24 * 60 * 60,
  [TimeRange.Month]: 30 * 24 * 60 * 60,
  [TimeRange.Week]: 7 * 24 * 60 * 60,
  [TimeRange.Day]: 24 * 60 * 60,
  [TimeRange.Hour]: 60 * 60,
};

// The interval in seconds returned for a given range from CoinGecko.
// https://www.coingecko.com/api/documentation
const rangeInterval: Record<TimeRange, number> = {
  // Daily.
  [TimeRange.Year]: 24 * 60 * 60,
  // Hourly.
  [TimeRange.Month]: 60 * 60,
  [TimeRange.Week]: 60 * 60,
  // Five minutes.
  [TimeRange.Day]: 5 * 60,
  [TimeRange.Hour]: 5 * 60,
};

const getRangeBounds = (range: TimeRange, endDate = new Date()) => {
  // Snap to a reasonable point in time.
  switch (range) {
    case TimeRange.Hour:
    case TimeRange.Day:
      endDate.setSeconds(0, 0);
      break;
    case TimeRange.Week:
      endDate.setMinutes(0, 0, 0);
      break;
    default:
      endDate.setHours(0, 0, 0);
  }

  // Floor is redundant since snapping above should clear milliseconds.
  const end = Math.floor(endDate.getTime() / 1000);
  const interval = rangeInterval[range];
  // Add additional buffer (three extra intervals) to the start time to account
  // for mismatching timestamps returned from CoinGecko for the same range with
  // different tokens.
  const start = end - rangeDuration[range] - interval * 3;

  return {
    start,
    end,
    interval: rangeInterval[range],
  };
};

// these timestamps will use an internally calculate twap and drop the price at this timestamp
const priceExclusions = {
  newt: {
    "1731888000000": true,
  },
};
export const fetchHistoricalPricesV2 = async (asset: {
  denom: string;
  coingeckoId: string;
}): Promise<CoinGeckoHistoricPrices> => {
  const response = await fetchMaybeCached(CACHE_KEYS.COINGECKO_PRICE_HISTORY, {
    id: asset.coingeckoId,
    range: "year",
    interval: "daily",
  });
  // const interval = "daily";
  // const range = TimeRange.Year;
  // const { start, end } = getRangeBounds(range);

  // const url = `https://pro-api.coingecko.com/api/v3/coins/${asset.coingeckoId}/market_chart/range?vs_currency=usd&from=${BigInt(start).toString()}&to=${BigInt(end).toString()}${interval ? `&interval=${interval}` : ""}`;
  // const data = await fetch(url, {
  //   headers: {
  //     "x-cg-pro-api-key": process.env.COINGECKO_API_KEY ?? "",
  //   },
  //   next: {
  //     revalidate: secondsToHours(1),
  //   },
  // });
  // const response = await data.json();

  const validated = CoinGeckoHistoricPricesSchema.safeParse(response);
  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_PRICES_ERROR}, Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }
  const twapLength = getTwapLength(twapRadius);
  const exclusion =
    asset.coingeckoId in priceExclusions && validated.data.length > twapLength
      ? priceExclusions[asset.coingeckoId]
      : null;

  let result;
  if (exclusion) {
    result = validated.data.map(([timestamp, price], i) => {
      if (timestamp in exclusion) {
        return [
          timestamp,
          calculateTwapAtIndex({ index: i, data: validated.data, twapRadius }),
        ];
      }
      return [timestamp, price];
    });
  } else result = validated.data;

  return result;
};

const twapRadius = 2; // 2 data points on each side, 4 total
const getTwapLength = (radius: number) => {
  return twapRadius * 2 + 1;
};

const calculateTwapAtIndex = ({
  index,
  data,
  twapRadius,
}: {
  index: number;
  data: CoinGeckoHistoricPrices;
  twapRadius: number;
}) => {
  let twapBounds = [index - twapRadius, index + twapRadius];

  if (twapBounds.some((i) => i < 0)) {
    while (twapBounds.some((i) => i < 0)) {
      twapBounds = shiftArrayValues(twapBounds, 1);
    }
  } else if (twapBounds.some((i) => i > data.length - 1)) {
    while (twapBounds.some((i) => i < 0)) {
      twapBounds = shiftArrayValues(twapBounds, -1);
    }
  }
  const dataPointsToAverage = [...data.slice(twapBounds[0], twapBounds[1] + 1)];
  // remove the middle element
  dataPointsToAverage.splice(twapRadius, 1);
  const twap =
    dataPointsToAverage.reduce((acc, [timestamp, price]) => acc + price, 0) /
    dataPointsToAverage.length;
  // compute twap of 5 prices
  return twap;
};
const shiftArrayValues = (arr: number[], constant: number) => {
  return arr.map((value) => value + constant);
};

export type FetchHistoricalValuesReturnValue = {
  baseDenom: string;
  historicalTargets: IndexerHistoricalTargetsResponse;
  values: Array<{
    timestamp: number;
    readableDate: string;
    tokens: Array<{
      denom: string;
      price: number;
      amount: number;
    }>;
  }>;
};
