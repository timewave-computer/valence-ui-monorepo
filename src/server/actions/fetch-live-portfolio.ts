"use server";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { CACHE_KEYS } from "@/const/ui-api-cache";
import {
  fetchMaybeCached,
  getStargateClient,
  isFulfilled,
  isRejected,
} from "@/server/utils";
import { OriginAsset } from "@/types/ibc";
import { z } from "zod";
import { FetchAccountConfigReturnValue } from "@/server/actions/fetch-valence-account-config";
import { baseToUnit } from "@/utils";

/***
 * STILL TODO:
 * fetch amounts on auction from indexer /auction/account [date=today] [address=address]
 */
export async function fetchLivePortfolio({
  address,
  baseDenom,
  targets,
}: {
  address: string;
  baseDenom: string;
  targets: FetchAccountConfigReturnValue["targets"];
}): Promise<FetchLivePortfolioReturnValue> {
  const stargateClient = await getStargateClient();

  // fetch balances on account
  let balances = await stargateClient.getAllBalances(address);

  // get coingecko ID for each target & fetch prices
  const coinGeckoIds =
    targets
      ?.filter((t) => !!t.asset.coingecko_id)
      .map((t) => t.asset.coingecko_id as string) ?? [];
  const coinGeckoPrices = await getPrices(coinGeckoIds);

  let totalValue = 0;

  const portfolioNoCalcs: Omit<LiveHolding, "distribution">[] = [];
  // compose each portfolio line
  targets.forEach((target) => {
    const denom = target.denom;
    const balance = balances.find((b) => b.denom === target.denom); // if target denom has no balances in account, its 0
    const amount = balance ? balance.amount : 0;
    const traceAsset = target.asset;
    const coinGeckoId = traceAsset.coingecko_id;
    let price: number = 0;
    if (coinGeckoId && coinGeckoId in coinGeckoPrices) {
      price = coinGeckoPrices[coinGeckoId];
    }

    const formattedAmount = baseToUnit(amount, traceAsset.decimals);
    portfolioNoCalcs.push({
      denom,
      target: target.percent,
      amount: formattedAmount,
      price: price,
      asset: target.asset,
    });

    if (price) totalValue += formattedAmount * price;
  });

  // compose with distribution
  const portfolio = portfolioNoCalcs.map((holding) => {
    return {
      ...holding,
      distribution: (holding.amount * holding.price) / totalValue,
    };
  });

  return Promise.resolve({
    baseDenom,
    totalValue,
    portfolio,
  });
}

export type LiveHolding = {
  denom: string;
  amount: number;
  price: number;
  asset: OriginAsset;
  target: number;
  distribution: number;
};

export type FetchLivePortfolioReturnValue = {
  baseDenom: string;
  portfolio: Array<LiveHolding>;
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
