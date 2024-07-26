"use client";

import { chainConfig } from "@/const/config";
import { useChain } from "@cosmos-kit/react-lite";

export const useChainContext = () => {
  // chain set in the env, for now
  const chainContext = useChain(chainConfig.chain.chain_name, false);
  return chainContext;
};

export const useWallet = () => {
  const chainContext = useChainContext();
  if (!chainContext.chainWallet) {
    const noWallet = {
      // populate these so we do not destructure from undefined object, if there is no wallet connected
      address: undefined,
    };
    return noWallet;
  }

  return chainContext.chainWallet;
};

export const useConnect = () => {
  const chainContext = useChain(chainConfig.chain.chain_name, false);
  return chainContext.walletRepo.wallets[0].connect;
};

export const useDisconnect = () => {
  const chainContext = useChain(chainConfig.chain.chain_name, false);
  return chainContext.walletRepo.wallets[0].disconnect;
};
