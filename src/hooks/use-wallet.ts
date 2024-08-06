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

  const wallet = chainContext.chainWallet;

  return {
    address: wallet?.address,
    // for some reason these are the ones that work for connecting and disconnecting
    connect: chainContext.walletRepo.wallets[0].connect,
    disconnect: chainContext.walletRepo.wallets[0].disconnect,

    // for some reason these are only accurate in chain context and not on wallet
    isWalletConnected: chainContext.isWalletConnected,
    isWalletConnecting: chainContext.isWalletConnecting,
  };
};
