import { mainnetChains, testnetChains } from "graz/chains";
import { ProgramsChainConfig } from "./ProgramsChainConfig"; // avoid circular dependency
import { ChainInfo } from "@keplr-wallet/types";

// lazy initialize to defer evaulation until ProgramsChainConfig initialized
// evaluate only once
let _defaultSupportedChains: ChainInfo[] | null = null;

export const getDefaultSupportedChains = (): ChainInfo[] => {
  if (!_defaultSupportedChains) {
    _defaultSupportedChains = ProgramsChainConfig.getSupportedChainIds().reduce(
      (acc, chainId) => {
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
      },
      [] as ChainInfo[],
    );
  }
  return _defaultSupportedChains;
};
