import { QueryConfig } from "@/app/programs/server";

const defaultNeutronRpc = process.env.NEXT_PUBLIC_DEFAULT_NEUTRON_RPC;
if (!defaultNeutronRpc) {
  throw new Error("Missing NEXT_PUBLIC_DEFAULT_NEUTRON_RPC");
}

const defaultRegistry = process.env.NEXT_PUBLIC_DEFAULT_REGISTRY;
if (!defaultRegistry) {
  throw new Error("Missing NEXT_PUBLIC_DEFAULT_REGISTRY");
}

export const getDefaultMainChainConfig = (): QueryConfig["main"] => {
  const rpcUrl = defaultNeutronRpc;
  return {
    chainId: "neutron-1",
    registryAddress: defaultRegistry,
    rpcUrl,
    name: "neutron",
  };
};

export const getPreferredRpcs = () => {
  return {
    "neutron-1": defaultNeutronRpc,
  };
};
