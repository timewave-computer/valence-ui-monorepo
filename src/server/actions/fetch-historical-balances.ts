"use server";
import { UTCDate } from "@date-fns/utc";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { IndexerUrl } from "@/server/utils";
import {
  IndexerHistoricalBalancesResponse,
  IndexerHistoricalBalancesResponseSchema,
} from "@/types/rebalancer";

export const fetchHistoricalBalances = async (
  address: string,
  { startDate, endDate }: { startDate: string; endDate: string },
): Promise<IndexerHistoricalBalancesResponse> => {
  const res = await fetch(
    IndexerUrl.historicalBalances(address, {
      startDate: new UTCDate(startDate),
      endDate: new UTCDate(endDate),
    }),
  );
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_BALANCES_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();
  const validated = IndexerHistoricalBalancesResponseSchema.safeParse(result);
  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_BALANCES_ERROR}, Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }

  const balances = validated.data;
  return balances.filter((balance) => balance.blockHeight !== -1);
};
