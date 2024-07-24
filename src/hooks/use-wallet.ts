"use client";

import { DEFAULT_CHAIN } from "@/const/chains";
import { useChain } from "@cosmos-kit/react-lite";

export const useWallet = () => {
  const chainContext = useChain(DEFAULT_CHAIN.chain_name, false);
  const wallet = chainContext.walletRepo.wallets[0]; // just keplr for now

  return wallet;
};
