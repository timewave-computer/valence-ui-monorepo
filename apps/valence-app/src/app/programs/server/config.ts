import { NEUTRON_RPC } from "@/server/utils";

export const defaultQueryConfig = {
  mainChainId: "neutron-1",
  registryAddress: "neutron1hj5fveer5cjtn4wd6wstzugjfdxzl0xpznmsky",
};

export const preferredRpcs = {
  "neutron-1": NEUTRON_RPC,
};

export type DefaultQueryConfig = typeof defaultQueryConfig;
