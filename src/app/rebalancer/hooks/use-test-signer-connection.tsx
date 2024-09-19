"use client";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { useWallet } from "@/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ToastMessage } from "@/components";

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
  }, [isWalletConnected, isConnectionTestRun]);
};
