"use client";

import { NEUTRON_CHAIN } from "@/const/neutron";
import { useChain } from "@cosmos-kit/react-lite";

export const useWallet = () => {
  const chainContext = useChain(NEUTRON_CHAIN.chain_name, false);
  const wallet = chainContext.walletRepo.wallets[0]; // just keplr for now

  return {
    address: wallet.address,
    isConnecting: wallet.isWalletConnecting,
    connect: wallet.connect,
    disconnect: wallet.disconnect,
    chainWallet: wallet.mainWallet,
    isConnected: wallet.isWalletConnected,
    status: wallet.walletStatus,
  };
};
