import { PublicProgramsConfig } from "@/app/programs/server";
import { mainnetChains, testnetChains } from "graz/chains";
import { ChainInfo } from "@keplr-wallet/types";

// this encompasses rebalancer pages too (neutron and neutron testnet)
export const programsSupportedChains =
  PublicProgramsConfig.getSupportedChainIds().reduce((acc, chainId) => {
    let found = Object.values(mainnetChains).find((chain) => {
      return chain.chainId === chainId;
    });
    if (found) {
      return [...acc, found];
    } else
      found = Object.values(testnetChains).find((chain) => {
        return chain.chainId === chainId;
      });
    if (found) {
      return [...acc, found];
    } else return acc;
  }, [] as ChainInfo[]);
