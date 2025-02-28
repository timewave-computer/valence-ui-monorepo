"use client";

import { chainConfig } from "@/const/config";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { useChain } from "@cosmos-kit/react-lite";

export const useChainContext = () => {
  // chain set in the env, for now
  const chainContext = useChain(chainConfig.chain.chain_name, false);
  return chainContext;
};

export const useWallet = () => {
  const chainContext = useChainContext();

  const wallet = chainContext.chainWallet;

  const getSigningStargateClient = () => {
    try {
      return chainContext.getSigningStargateClient();
    } catch (err) {
      throw ErrorHandler.makeError(ERROR_MESSAGES.STARGATE_SIGNER_FAIL, err);
    }
  };

  const getSigningCosmWasmClient = () => {
    try {
      return chainContext.getSigningCosmWasmClient();
    } catch (err) {
      throw ErrorHandler.makeError(ERROR_MESSAGES.COSMWASM_SIGNER_FAIL, err);
    }
  };

  return {
    walletInfo: wallet?.walletInfo,
    address: wallet?.address,
    walletStatus: chainContext.walletRepo.wallets[0].walletStatus,
    // for some reason these are the ones that work for connecting and disconnecting
    connect: chainContext.walletRepo.wallets[0].connect,
    disconnect: chainContext.walletRepo.wallets[0].disconnect,

    // for some reason these are only accurate in chain context and not on wallet
    isWalletConnected: chainContext.isWalletConnected,
    isWalletConnecting: chainContext.isWalletConnecting,
    getStargateClient: chainContext.getStargateClient,
    getSigningStargateClient,
    getCosmWasmClient: chainContext.getCosmWasmClient,
    getSigningCosmwasmClient: getSigningCosmWasmClient,
  };
};
