"use server";
import { chainConfig } from "@/const/config";
import { getStargateClient } from "@/server/rpc";
import { Coin } from "@cosmjs/proto-signing";

export async function fetchRebalancerAccountBalances({
  address,
}: {
  address: string;
}): Promise<Coin[]> {
  const stargateClient = await getStargateClient();

  const balanceRequests = chainConfig.supportedRebalancerAssets.map((asset) =>
    stargateClient.getBalance(address, asset.denom),
  );

  return Promise.all(balanceRequests);
}
