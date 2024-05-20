"use server";

import { NEUTRON_CHAIN_ID } from "@/const/neutron";
import { getOriginAssets, getPrices, getStargateClient } from "@/server/utils";
import { CoingeckoPrice } from "@/types/coingecko";
import { OriginAsset } from "@/types/ibc";

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
    let price: CoingeckoPrice | null = null;
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
