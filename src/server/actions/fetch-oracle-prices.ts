"use server";
import { ErrorHandler, ERROR_MESSAGES } from "@/const/error";
import { UTCDate } from "@date-fns/utc";
import { IndexerUrl } from "@/server/utils";
import { hoursToSeconds, subDays } from "date-fns";
import {
  IndexerOraclePricesResponse,
  IndexerOraclePricesResponseSchema,
} from "@/types/rebalancer";

/**
 * for fetching oracle prices from the indexer. Not used currently but here if needed
 */

export const fetchOraclePrices = async (
  denom: string,
  options?: {
    baseDenom?: string;
  },
): Promise<IndexerOraclePricesResponse> => {
  const url = IndexerUrl.historicOraclePrices(denom, {
    startDate: subDays(new UTCDate(), 365),
    endDate: new UTCDate(),
    baseDenom: options?.baseDenom,
  });
  const res = await fetch(url, {
    // signal: AbortSignal.timeout(10000),
    next: {
      revalidate: hoursToSeconds(1),
    },
  });
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_PRICES_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();
  const validated = IndexerOraclePricesResponseSchema.safeParse(result);
  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_PRICES_ERROR}, Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }
  return validated.data;
};
