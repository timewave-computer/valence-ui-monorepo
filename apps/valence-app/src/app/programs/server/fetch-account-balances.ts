import { getStargateClient } from "@/server/rpc";
import { Coin } from "@cosmjs/stargate";

export const fetchAccountBalances = async ({
  rpcUrl,
  accountAddress,
}: {
  accountAddress: string;
  rpcUrl: string;
}): Promise<readonly Coin[]> => {
  // TODO: try all rpcs until successful
  const client = await getStargateClient(rpcUrl);
  const results = await client.getAllBalances(accountAddress);
  return results;
};
