"use server";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { CACHE_KEYS } from "@/server/utils/ui-api-cache";
import {
  fetchMaybeCached,
  getStargateClient,
  isFulfilled,
  isRejected,
} from "@/server/utils";
import { OriginAsset } from "@/types/ibc";
import { z } from "zod";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { baseToUnit } from "@/utils";
import { IndexerUrl } from "@/server/utils";
import { IndexerFundsInAuctionSchema } from "@/types/indexer";

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
  let balances = (await stargateClient.getAllBalances(address)).map((b) => {
    return {
      denom: b.denom,
      amount: Number(b.amount),
    };
  });

  // get coingecko ID for each target & fetch prices
  const coinGeckoIds =
    targets
      ?.filter((t) => !!t.asset.coingecko_id)
      .map((t) => t.asset.coingecko_id as string) ?? [];
  const coinGeckoPrices = await getPrices(coinGeckoIds);

  let totalValue = 0;

  const auctionBalances = await getAuctionBalances(address);

  const portfolioWithoutDistribution: Omit<LiveHolding, "distribution">[] = [];
  // compose each portfolio line
  targets.forEach((target) => {
    const denom = target.denom;
    const accountBalance =
      balances.find((b) => b.denom === target.denom)?.amount ?? 0; // if target denom has no balances in account, its 0
    const auctionBalance = auctionBalances[target.denom] ?? 0;
    const amount = accountBalance + auctionBalance;
    const traceAsset = target.asset;
    const coinGeckoId = traceAsset.coingecko_id;
    let price: number = 0;
    if (coinGeckoId && coinGeckoId in coinGeckoPrices) {
      price = coinGeckoPrices[coinGeckoId];
    }

    const formattedAmount = baseToUnit(amount, traceAsset.decimals);
    portfolioWithoutDistribution.push({
      denom,
      target: target.percentage,
      amount: formattedAmount,
      price: price,
      asset: target.asset,
    });

    if (price) totalValue += formattedAmount * price;
  });

  // compose with distribution
  const portfolio = portfolioWithoutDistribution.map((holding) => {
    return {
      ...holding,
      distribution: (holding.amount * holding.price) / totalValue,
    };
  });

  return {
    baseDenom,
    portfolio,
  };
}

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

const getAuctionBalances = async (
  address: string,
): Promise<Record<string, number>> => {
  const res = await fetch(IndexerUrl.fundsInAuction(address));
  if (!res.ok) {
    throw ErrorHandler.makeError(
      `${ERROR_MESSAGES.INDEXER_FUNDS_IN_AUCTION_ERROR}, API Error: ${res.status}, ${res.statusText}`,
    );
  }
  if (!res.body) {
    // this is considered as 'no funds in auction', return empty
    return {};
  }
  const data = await res.json();
  const balances = IndexerFundsInAuctionSchema.parse(data);
  const result: Record<string, number> = {};
  balances.forEach((balance) => {
    const denom = balance.pair[0];
    const amount = parseFloat(balance.amount);
    result[denom] = amount;
  });
  return result;
};

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
