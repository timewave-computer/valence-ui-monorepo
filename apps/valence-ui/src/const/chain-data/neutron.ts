import { chains } from "chain-registry";

const registeredNeutron = chains.find(
  (chain) => chain.chain_name === "neutron",
);
if (!registeredNeutron) throw new Error("Neutron chain not found in registry");

export const NEUTRON_CHAIN= registeredNeutron

