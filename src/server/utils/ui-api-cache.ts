/***
 * UTIL to make API call through our API cache
 * If key exists and is within TTL, will return cached response.
 * If not, it will make new query and cache response
 * calling service defined here https://github.com/timewave-computer/snapper
 */

import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";

const API_CACHE_URL = process.env.API_CACHE_URL;
if (!API_CACHE_URL) throw new Error("Please provide API_CACHE_URL");

export const fetchMaybeCached = async (
  queryName: string,
  args: { [r: string]: any },
  options?: {
    cache?: "force-cache" | "no-store";
  },
): Promise<unknown> => {
  const url =
    API_CACHE_URL + "/q/" + queryName + "?" + new URLSearchParams(args);

  const cacheOptions = options?.cache ?? "no-store";
  const response = await fetch(url, {
    cache: cacheOptions,
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.CACHED_QUERY_FAIL} for url ${url}: ${response.status}, ${response.statusText}`,
    );
  }
  const data = await response.json();
  return data;
};

// managed in https://github.com/timewave-computer/snapper
export const CACHE_KEYS = {
  COINGECKO_PRICE: "coingecko-price",
  COINGECKO_PRICE_HISTORY: "coingecko-price-history",
};
