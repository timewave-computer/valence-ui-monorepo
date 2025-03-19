import { ProgramQueryConfig } from "@/app/programs/server";

const defaultNeutronRpc = process.env.NEXT_PUBLIC_DEFAULT_NEUTRON_RPC;
if (!defaultNeutronRpc) {
  throw new Error("Missing NEXT_PUBLIC_DEFAULT_NEUTRON_RPC");
}

const defaultRegistry = process.env.NEXT_PUBLIC_DEFAULT_REGISTRY;
if (!defaultRegistry) {
  throw new Error("Missing NEXT_PUBLIC_DEFAULT_REGISTRY");
}

export const defaultDomainName = "neutron";

export const getDefaultMainChainConfig = (): ProgramQueryConfig["main"] => {
  const rpcUrl = defaultNeutronRpc;
  return {
    chainId: "neutron-1",
    registryAddress: defaultRegistry,
    rpc: rpcUrl,
    domainName: defaultDomainName,
    chainName: defaultDomainName,
  };
};
