import { getNeutronRpc } from "@/server/rpc";
import { QueryConfig } from "@/app/programs/server";

export const getDefaultMainChainConfig = (): QueryConfig["main"] => {
  return {
    chainId: "neutron-1",
    registryAddress: "neutron1hj5fveer5cjtn4wd6wstzugjfdxzl0xpznmsky",
    rpc: getNeutronRpc(),
  };
};

export const getPreferredRpcs = () => {
  return {
    "neutron-1": getNeutronRpc(),
  };
};
