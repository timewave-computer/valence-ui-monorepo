import { ErrorHandler } from "@/const/error";
import { CoinGeckoHistoricPrice } from "@/types/coingecko";

// Helper function to find the price with the closest timestamp
export function findClosestCoingeckoPrice(
  balanceTimestamp: number,
  prices: Array<CoinGeckoHistoricPrice>,
): number {
  if (prices.length === 0) {
    ErrorHandler.warn("No prices found for denom");
    return 0;
  }
  const sorted = prices.sort(
    (a, b) =>
      Math.abs(balanceTimestamp - Number(a[0])) - // prices are in form [timestamp, price]  [ 1714611745449, 1.0007257446162172 ],
      Math.abs(balanceTimestamp - Number(b[0])),
  );
  return sorted[0][1]; // take first element, extract price
}

// Helper function to find the price with the closest timestamp
export function findClosestTimestampObject(
  targetTimestamp: number,
  timestampObjects: Array<{ timestamp: number; [key: string]: any }>,
) {
  if (timestampObjects.length === 0) {
    ErrorHandler.warn("No prices provided");
    return { timestamp: targetTimestamp } as {
      timestamp: number;
      [key: string]: any;
    };
  }
  const sorted = timestampObjects.sort(
    (a, b) =>
      Math.abs(targetTimestamp - Number(a[0])) - // prices are in form [timestamp, price]  [ 1714611745449, 1.0007257446162172 ],
      Math.abs(targetTimestamp - Number(b[0])),
  );
  return sorted[0];
}
