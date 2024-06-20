"use server";
import { UTCDate } from "@date-fns/utc";
import { AccountTarget, fetchHistoricalTargets } from "@/server/actions";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import {
  CACHE_KEYS,
  IndexerUrl,
  fetchMaybeCached,
  findClosestCoingeckoPrice,
} from "@/server/utils";
import { USDC_DENOM } from "@/const/usdc";
import {
  IndexerHistoricalBalancesResponse,
  IndexerHistoricalBalancesResponseSchema,
  IndexerHistoricalTargetsResponse,
} from "@/types/indexer";
import { baseToUnit } from "@/utils";
import {
  CoinGeckoHistoricPrices,
  CoinGeckoHistoricPricesSchema,
} from "@/types/coingecko";

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
  startDate: string;
  endDate: string;
}): Promise<FetchHistoricalValuesReturnValue> {
  /***
   * 1. fetch historical balances
   * 2. for each denom, fetch historical prices
   * 3. compute values & return in format easy to digest for the graph
   */
  const startInUTC = new UTCDate(startDate);
  const endInUTC = new UTCDate(endDate);

  const historicalTargets = await fetchHistoricalTargets({
    address,
    startDate,
    endDate,
  });

  const historicBalances = await fetchHistoricalBalances(address, {
    startDate: startInUTC,
    endDate: endInUTC,
  });
  const historicPrices = await fetchHistoricalPrices(targets);
  const results: FetchHistoricalValuesReturnValue["values"] = [];
  historicBalances.forEach((balance) => {
    const balanceTimestamp = Number(balance.at);

    const tokens: FetchHistoricalValuesReturnValue["values"][0]["tokens"] = [];
    targets.forEach((target) => {
      let price: number | null = null;
      const pricesForDenom = historicPrices.find(
        (historicPrices) =>
          historicPrices.coinGeckoId === target.asset.coingecko_id,
      )?.prices;
      if (!pricesForDenom) {
        ErrorHandler.warn(`No historic prices found for ${target.denom}`);
        return;
      }
      price = findClosestCoingeckoPrice(balanceTimestamp, pricesForDenom);
      if (!price) {
        // should not happen BUT just in case
        ErrorHandler.warn(`No prices found for ${target.denom}`);
        return;
      }

      tokens.push({
        denom: target.denom,
        amount:
          target.denom in balance.value
            ? baseToUnit(
                Number(balance.value[target.denom]),
                target.asset.decimals,
              )
            : 0,
        price: price,
      });
    });
    const ts = Number(balance.at);

    results.push({
      timestamp: ts,
      readableDate: new UTCDate(ts).toISOString(),
      tokens: tokens,
    });
  });

  return {
    baseDenom: USDC_DENOM,
    values: results,
    historicalTargets,
  };
}

export const fetchHistoricalBalances = async (
  address: string,
  { startDate, endDate }: { startDate: Date; endDate: Date },
): Promise<IndexerHistoricalBalancesResponse> => {
  const res = await fetch(
    IndexerUrl.historicalBalances(address, {
      startDate,
      endDate,
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
  targets: Array<AccountTarget>,
): Promise<CoinGeckoHistoricPrices> => {
  const coinGeckoIds =
    targets
      ?.filter((t) => !!t.asset.coingecko_id)
      .map((t) => t.asset.coingecko_id as string) ?? [];

  const historicPricePromises = coinGeckoIds.map(async (coinGeckoId) => {
    const data = await fetchMaybeCached(CACHE_KEYS.COINGECKO_PRICE_HISTORY, {
      id: coinGeckoId,
      range: "year",
      interval: "daily",
    });
    return {
      coinGeckoId,
      prices: data,
    };
  });

  const pricesDirty = await Promise.all(historicPricePromises);
  const validated = CoinGeckoHistoricPricesSchema.safeParse(pricesDirty);

  if (!validated.success) {
    const errMsg = validated.error.errors.slice(0, 3); // truncate, array errors are large and redunant
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_HISTORICAL_BALANCES_ERROR}, Validation Error (first three items): ${JSON.stringify(errMsg, null, 2)}`,
    );
  }
  const prices = validated.data;
  return prices;
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
