"use server";
import { getStargateClient } from "@/server/utils";
import { Coin } from "@cosmjs/proto-signing";

export async function fetchAccountBalances({
  address,
  targetDenoms,
}: {
  address: string;
  targetDenoms: string[];
}): Promise<Coin[]> {
  const stargateClient = await getStargateClient();

  const balanceRequests = targetDenoms.map((denom) =>
    stargateClient.getBalance(address, denom),
  );

  return Promise.all(balanceRequests);
}
