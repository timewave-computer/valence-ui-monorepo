import { getStargateClient } from "@/server/utils";
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
  return client.getAllBalances(accountAddress);
};
