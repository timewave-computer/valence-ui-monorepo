import { NEUTRON_RPC } from "@/app/server";
import { QueryConfig } from "@/app/programs/server";

export const defaultMainChainConfig: QueryConfig["main"] = {
  chainId: "neutron-1",
  registryAddress: "neutron1hj5fveer5cjtn4wd6wstzugjfdxzl0xpznmsky",
  rpc: NEUTRON_RPC!,
};

export const preferredRpcs = {
  "neutron-1": NEUTRON_RPC,
};
