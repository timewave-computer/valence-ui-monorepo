"use server";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import {
  fetchMaybeCached,
  isFulfilled,
  isRejected,
  CACHE_KEYS,
} from "@/server/utils";
import { z } from "zod";

export const getPrices = async (
  coingeckoIds: string[],
): Promise<Record<string, number>> => {
  if (!coingeckoIds.length) {
    ErrorHandler.warn("No IDs to fetch prices for");
    return {};
  }
  const promises = coingeckoIds.map(async (id) => {
    try {
      const data = await fetchMaybeCached(CACHE_KEYS.COINGECKO_PRICE, { id });
      const validated = z.number().safeParse(data);
      if (!validated.success) {
        throw ErrorHandler.makeError(
          `${ERROR_MESSAGES.COINGECKO_PRICE_FAIL}: Validation error ${validated.error}`,
        );
      }
      const price = validated.data;

      return {
        coinGeckoId: id,
        price: price,
      };
    } catch (e) {
      throw ErrorHandler.makeError(
        `${ERROR_MESSAGES.COINGECKO_PRICE_FAIL},${e}`,
      );
    }
  });

  const settled = await Promise.allSettled(promises);
  const prices: Record<string, number> = {};

  settled.filter(isFulfilled).forEach((promise) => {
    if (promise.value?.coinGeckoId)
      prices[promise.value.coinGeckoId] = promise.value.price;
  });
  settled.filter(isRejected).forEach((promise) => {
    ErrorHandler.warn(
      ERROR_MESSAGES.COINGECKO_PRICE_FAIL +
        `: ${promise.status}, ${promise.reason}`,
    );
  });
  return prices;
};
