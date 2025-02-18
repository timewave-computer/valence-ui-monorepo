import { QueryConfig } from "@/app/programs/server";

export const getDefaultMainChainConfig = (): QueryConfig["main"] => {
  const rpcUrl = defaultNeutronRpc;
  return {
    chainId: "neutron-1",
    registryAddress: undefined,
    rpcUrl,
    name: "neutron",
  };
};

export const getPreferredRpcs = () => {
  return {
    "neutron-1": defaultNeutronRpc,
  };
};

const defaultNeutronRpc = "https://rpc-voidara.neutron-1.neutron.org";
