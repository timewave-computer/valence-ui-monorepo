"use server";
import { UTCDate } from "@date-fns/utc";
import { IndexerUrl } from "@/server/utils";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import {
  IndexerHistoricalTargetsResponse,
  IndexerHistoricalTargetsResponseSchema,
} from "@/types/rebalancer";

export async function fetchHistoricalTargets({
  address,
  startDate,
  endDate,
}: {
  address: string;
  startDate: string;
  endDate: string;
}): Promise<IndexerHistoricalTargetsResponse> {
  const url = IndexerUrl.historicalTargets(address, {
    startDate: new UTCDate(startDate),
    endDate: new UTCDate(endDate),
  });
  const res = await fetch(url);
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_TARGETS_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();

  const validated = IndexerHistoricalTargetsResponseSchema.safeParse(result);
  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_TARGETS_ERROR}, Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }

  return validated.data;
}
