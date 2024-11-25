"use server";
import { chainConfig } from "@/const/config";
import { getPrices } from "./fetch-prices";
import { Coin } from "@cosmjs/stargate";
import { fetchOriginAssets } from "@/server/actions";
import { getStargateClient } from "@/server/rpc";

export async function fetchSupportedBalances({
  address,
}: {
  address: string;
}): Promise<FetchSupportedBalancesReturnValue> {
  const stargateClient = await getStargateClient();
  const requests = chainConfig.supportedAssets.map((asset) => {
    return stargateClient.getBalance(address, asset.denom);
  });
  const balances = (await Promise.all(requests)).filter(
    (b) => b.amount !== "0",
  );

  const originAssets = await fetchOriginAssets(
    balances.map((b) => {
      return {
        denom: b.denom,
        chain_id: chainConfig.chain.chain_id,
      };
    }),
  );

  const prices = await getPrices(
    originAssets.map((a) => a.asset.coingecko_id as string),
  );

  // sort alphabetically by symbol
  return balances
    .map((balance, i) => {
      const asset = originAssets[i].asset;
      const price = prices[asset.coingecko_id as string] ?? 0;
      return {
        ...balance,
        price,
        asset,
      };
    })
    .sort((a, b) => a.asset.symbol.localeCompare(b.asset.symbol));
}

export type FetchSupportedBalancesReturnValue = Array<
  Coin & {
    price: number;
  }
>;
