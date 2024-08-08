"use server";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { CACHE_KEYS, fetchMaybeCached } from "@/server/utils";
import { IndexerHistoricalTargetsResponse } from "@/types/rebalancer";
import {
  CoinGeckoHistoricPrices,
  CoinGeckoHistoricPricesSchema,
} from "@/types/coingecko";

export const fetchHistoricalPricesV2 = async (asset: {
  denom: string;
  coingeckoId: string;
}): Promise<CoinGeckoHistoricPrices> => {
  const response = await fetchMaybeCached(CACHE_KEYS.COINGECKO_PRICE_HISTORY, {
    id: asset.coingeckoId,
    range: "year",
    interval: "daily",
  });

  const validated = CoinGeckoHistoricPricesSchema.safeParse(response);

  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_PRICES_ERROR}, Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }
  return validated.data;
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
