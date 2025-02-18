import { getNeutronRpc } from "@/server/rpc";
import { QueryConfig } from "@/app/programs/server";

export const getDefaultMainChainConfig = (): QueryConfig["main"] => {
  const rpcUrl = getNeutronRpc();
  return {
    chainId: "neutron-1",
    registryAddress: "sample-registry-address",
    rpcUrl,
    name: "neutron",
  };
};

export const getPreferredRpcs = () => {
  return {
    "neutron-1": getNeutronRpc(),
  };
};
