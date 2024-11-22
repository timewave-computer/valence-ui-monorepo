import { getStargateClient, NEUTRON_RPC } from "@/server/utils";
import { Coin } from "@cosmjs/stargate";

export const getAccountBalances = async ({
  rpcUrl,
  accountAddress,
}: {
  accountAddress: string;
  rpcUrl: string;
}): Promise<readonly Coin[]> => {
  const client = await getStargateClient(rpcUrl);
  return client.getAllBalances(accountAddress);
};
