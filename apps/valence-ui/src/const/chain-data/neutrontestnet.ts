import { chains } from "chain-registry";

const registeredNeutronTestnet = chains.find(
  (chain) => chain.chain_name === "neutrontestnet",
);
if (!registeredNeutronTestnet){
  throw new Error("Neutron Testnet chain not found in registry");
}

export const NEUTRON_TESTNET_CHAIN= registeredNeutronTestnet

