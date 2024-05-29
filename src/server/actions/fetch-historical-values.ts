"use server";
import { UTCDate } from "@date-fns/utc";
import { AccountTarget } from "@/server/actions/fetch-valence-account-config";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { IndexerUrl } from "@/server/utils";
import { USDC_DENOM } from "@/const/usdc";
import {
  IndexerHistoricalBalancesResponse,
  IndexerHistoricalBalancesResponseSchema,
  IndexerHistoricalPricesResponse,
  IndexerHistoricalPricesResponseSchema,
  IndexerPrice,
} from "@/types/indexer";

export async function fetchHistoricalValues({
  address,
  startDate,
  endDate,
  baseDenom,
  targets,
}: {
  baseDenom: string;
  targets: Array<AccountTarget>;
  address: string;
  startDate: Date;
  endDate: Date;
}): Promise<FetchHistoricalValuesReturnValue> {
  /***
   * 1. fetch historical balances
   * 2. for each denom, fetch historical prices
   * 3. compute values & return in format easy to digest for the graph
   */
  const historicBalances = await fetchHistoricalBalances(address);
  const pricePromises = targets
    .filter((t) => t.denom !== USDC_DENOM)
    .map(async (target) => {
      return {
        denom: target.denom,
        prices: await fetchHistoricalPrices(target.denom),
      };
    });
  const historicPricesRaw = await Promise.all(pricePromises);
  const historicPrices: HistoricPrices = historicPricesRaw.map(
    (priceResponse) => {
      const filtered = priceResponse.prices
        .filter((price) => !!price.value)
        .map((price) => price.value);
      return {
        denom: priceResponse.denom,
        prices: filtered as IndexerPrice[],
      };
    },
  );

  const results: FetchHistoricalValuesReturnValue["values"] = [];
  historicBalances.forEach((balance) => {
    const balanceTimestamp = balance.blockTimeUnixMs;

    const tokens: FetchHistoricalValuesReturnValue["values"][0]["tokens"] = [];
    targets.forEach((target) => {
      if (!(target.denom in balance.value)) return;
      let price = 0;
      if (target.denom === USDC_DENOM) {
        price = 1;
      } else {
        const pricesForDenom = historicPrices.find(
          (historicPrices) => historicPrices.denom === target.denom,
        )?.prices;
        if (!pricesForDenom) {
          ErrorHandler.warn(`No historic prices found for ${target.denom}`);
          return;
        }
        const closestPrice = findClosestPrice(balanceTimestamp, pricesForDenom);
        price = Number(closestPrice?.price) ?? 0;
      }

      tokens.push({
        denom: target.denom,
        amount: Number(balance.value[target.denom]),
        decimals: target.asset.decimals,
        price: price,
      });
    });

    results.push({
      timestamp: balance.blockTimeUnixMs,
      tokens: tokens,
    });
  });

  return {
    baseDenom: USDC_DENOM,
    values: results,
  };
}

type HistoricPrices = Array<{
  denom: string;
  prices: Array<IndexerPrice>;
}>;

// Helper function to find the price with the closest timestamp
function findClosestPrice(
  balanceTimestamp: number,
  prices: HistoricPrices[0]["prices"],
): IndexerHistoricalPricesResponse[0]["value"] {
  return prices.sort(
    (a, b) =>
      Math.abs(balanceTimestamp - Number(a.time)) -
      Math.abs(balanceTimestamp - Number(b.time)),
  )[0];
}

export const fetchHistoricalBalances = async (
  address: string,
): Promise<IndexerHistoricalBalancesResponse> => {
  const res = await fetch(
    IndexerUrl.historicalBalances(address, {
      startDate: new UTCDate(),
      dayRange: 365,
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

export const fetchHistoricalPrices = async (
  denom: string,
  options?: {
    baseDenom?: string;
  },
): Promise<IndexerHistoricalPricesResponse> => {
  const url = IndexerUrl.historicalPrices(denom, {
    startDate: new UTCDate(),
    dayRange: 365,
    baseDenom: options?.baseDenom,
  });
  const res = await fetch(url);
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_PRICES_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  const result = await res.json();
  const validated = IndexerHistoricalPricesResponseSchema.safeParse(result);
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
  values: Array<{
    timestamp: number;
    tokens: Array<{
      denom: string;
      price: number;
      amount: number;
      decimals: number;
    }>;
  }>;
};
