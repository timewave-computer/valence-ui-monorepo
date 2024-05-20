import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import {
  CoingeckoSimplePriceResponse,
  CoingeckoSimplePriceResponseSchema,
} from "@/types/coingecko";

const API_KEY = process.env.COINGECKO_API_KEY;
if (!API_KEY) throw new Error("Please provide COINGECKO_API_KEY");

const COINGECKO_URL = "https://api.coingecko.com/api";

export const getPrices = async (
  coingeckoIds: string[],
): Promise<CoingeckoSimplePriceResponse> => {
  if (!coingeckoIds.length) {
    ErrorHandler.warn("No IDs to fetch prices for");
    return {};
  }
  const idList = coingeckoIds.reduce((acc: string, id: string) => {
    return `${acc},${id}`;
  });
  const res = await fetch(
    COINGECKO_URL +
      "/v3/simple/price" +
      "?" +
      new URLSearchParams({
        ids: idList,
        vs_currencies: "usd", // guarantees usd in return response
        include_last_updated_at: "true",
        precision: "full",
      }),
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "x-cg-demo-api-key": API_KEY,
      },
    },
  );

  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.COINGECKO_PRICE_FAIL}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();
  const validated = CoingeckoSimplePriceResponseSchema.safeParse(result);
  if (!validated.success) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.COINGECKO_PRICE_FAIL}, Zod Validation Error: ${res.status}, ${res.statusText}`,
    );
  }
  return validated.data;
};
