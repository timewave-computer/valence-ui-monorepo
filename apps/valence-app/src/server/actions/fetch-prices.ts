"use server";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import {
  fetchMaybeCached,
  isFulfilled,
  isRejected,
  CACHE_KEYS,
} from "@/server/utils";
import { secondsToMinutes } from "date-fns";
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
      const result = await fetchMaybeCached(CACHE_KEYS.COINGECKO_PRICE, { id });
      // const data = await fetch(
      //   `https://pro-api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
      //   {
      //     headers: {
      //       "x-cg-pro-api-key": process.env.COINGECKO_API_KEY ?? "",
      //     },
      //     next: {
      //       revalidate: secondsToMinutes(5),
      //     },
      //   },
      // );
      // const result = await data.json();
      const validated = z.number().safeParse(result);
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
