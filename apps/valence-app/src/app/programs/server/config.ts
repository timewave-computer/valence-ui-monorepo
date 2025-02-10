import { getCosmwasmClient, getNeutronRpc } from "@/server/rpc";
import { QueryConfig } from "@/app/programs/server";

export const getDefaultMainChainConfig = async (): Promise<
  QueryConfig["main"]
> => {
  const rpcUrl = getNeutronRpc();
  const client = await getCosmwasmClient(rpcUrl); // this should throw error if fails
  return {
    chainId: "neutron-1",
    registryAddress: "neutron1hj5fveer5cjtn4wd6wstzugjfdxzl0xpznmsky",
    rpcUrl,
    name: "neutron",
    cosmwasmClient: client,
  };
};

export const getPreferredRpcs = () => {
  return {
    "neutron-1": getNeutronRpc(),
  };
};
