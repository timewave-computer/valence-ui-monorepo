import { getStargateClient, NEUTRON_RPC } from "@/server/utils";
import { Coin } from "@cosmjs/stargate";

// TODO: this will eventually become a customizable field. this is just temporary
const DefaultRpcConfig: Record<string, string | undefined> = {
  neutron: NEUTRON_RPC,
  "neutron testnet": "https://rpc-falcron.pion-1.ntrn.tech",
};

export const getAccountBalances = async ({
  chainName,
  accountAddress,
}: {
  chainName: string;
  accountAddress: string;
}): Promise<readonly Coin[]> => {
  const rpcUrl = DefaultRpcConfig[chainName];
  if (!rpcUrl) {
    throw new Error(`No RPC configured for ${chainName}`);
  }

  const client = await getStargateClient(rpcUrl);
  return client.getAllBalances(accountAddress);
};
