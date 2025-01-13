"use client";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { useWallet } from "@/hooks";
import { useEffect, useState } from "react";
import { ToastMessage, toast } from "@valence-ui/ui-components";

export const useTestSignerConnection = () => {
  const {
    address: _walletAddress,
    getSigningStargateClient,
    isWalletConnected,
  } = useWallet();
  const [isConnectionTestRun, setIsConnectionTestRun] = useState(false);

  const testConnection = async () => {
    if (!isWalletConnected) return;
    try {
      await getSigningStargateClient();
      setIsConnectionTestRun(true);
    } catch (e) {
      ErrorHandler.makeError(ERROR_MESSAGES.SIGNER_CONNECTION_ERROR, e);
      toast.error(
        <ToastMessage variant="error" title="Wallet connection issue.">
          Reload the page and reconnect your wallet.
        </ToastMessage>,
      );
    }
  };

  useEffect(() => {
    if (isWalletConnected) testConnection();
    // adding testConnection makes component rerender and error shows consistent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalletConnected, isConnectionTestRun]);
};
