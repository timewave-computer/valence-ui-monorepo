"use server";

import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { NEUTRON_CHAIN_ID } from "@/const/neutron";
import { CACHE_KEYS } from "@/const/ui-api-cache";
import {
  fetchMaybeCached,
  getOriginAssets,
  getStargateClient,
  isFulfilled,
  isRejected,
} from "@/server/utils";
import { CoingeckoPrice } from "@/types/coingecko";
import { OriginAsset } from "@/types/ibc";
import { z } from "zod";

/***
 * STILL TODO:
 * fetch amounts on auction from indexer /auction/account [date=today] [address=address]
 */
export async function fetchLivePortfolio({
  address,
  baseDenom,
  targetDenoms,
}: {
  address: string;
  baseDenom: string;
  targetDenoms: string[];
}): Promise<FetchLivePortfolioReturnValue> {
  const stargateClient = await getStargateClient();

  let balances = await stargateClient.getAllBalances(address);
  balances = balances.filter((b) => !(b.denom in targetDenoms));

  const originAssets = await getOriginAssets(
    balances.map((b) => {
      return {
        denom: b.denom,
        chain_id: NEUTRON_CHAIN_ID,
      };
    }),
  );

  const coinGeckoIds = originAssets
    .filter((id) => !!id)
    .map((a) => a.asset.coingecko_id as string);
  const coinGeckoPrices = await getPrices(coinGeckoIds);

  const portfolio: any[] = [];
  // for each portfolio balance, pull in origin asset trace + coingecko price
  balances.forEach((balance, i) => {
    const { denom, amount } = balance;
    const traceAsset = originAssets[i];
    const coinGeckoId = traceAsset.asset.coingecko_id;
    let price: number | null = null;
    if (coinGeckoId && coinGeckoId in coinGeckoPrices) {
      price = coinGeckoPrices[coinGeckoId];
    }
    portfolio.push({
      denom,
      amount: Number(amount),
      price,
      asset: traceAsset,
    });
  });
  return Promise.resolve({
    baseDenom,
    portfolio,
  });
}

export type FetchLivePortfolioReturnValue = {
  baseDenom: string;
  portfolio: Array<{
    denom: string;
    amount: number;
    price: CoingeckoPrice | null;
    asset: OriginAsset;
  }>;
};

const getPrices = async (
  coingeckoIds: string[],
): Promise<Record<string, number>> => {
  if (!coingeckoIds.length) {
    ErrorHandler.warn("No IDs to fetch prices for");
    return {};
  }
  const promises = coingeckoIds.map(async (id) => {
    try {
      const data = await fetchMaybeCached(CACHE_KEYS.COINGECKO_PRICE, { id });
      const price = z.number().parse(data);
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
