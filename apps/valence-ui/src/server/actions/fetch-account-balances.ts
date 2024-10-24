"use server";
import { chainConfig } from "@/const/config";
import { getStargateClient } from "@/server/utils";
import { Coin } from "@cosmjs/proto-signing";

export async function fetchAccountBalances({
  address,
}: {
  address: string;
}): Promise<Coin[]> {
  const stargateClient = await getStargateClient();

  const balanceRequests = chainConfig.supportedAssets.map((asset) =>
    stargateClient.getBalance(address, asset.denom),
  );

  return Promise.all(balanceRequests);
}
