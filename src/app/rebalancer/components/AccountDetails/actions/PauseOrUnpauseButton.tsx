"use client";
import { useAtom } from "jotai";
import { useAccountConfigQuery } from "@/app/rebalancer/hooks";
import { accountAtom } from "@/app/rebalancer/globals";
import { Button, ToastMessage } from "@/components";
import { QUERY_KEYS } from "@/const/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks";
import { AccountClient } from "@/codegen/ts-codegen/Account.client";
import { toast } from "sonner";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";

export const PauseOrUnpauseButton: React.FC<{}> = () => {
  const queryClient = useQueryClient();
  const { address: walletAddress, getSigningCosmwasmClient } = useWallet();
  const [selectedAccountAddress] = useAtom(accountAtom);
  const { data: config } = useAccountConfigQuery({
    account: selectedAccountAddress,
  });

  const pauseRebalancer = async () => {
    const cwClient = await getSigningCosmwasmClient();
    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    const valenceAccountClient = new AccountClient(
      cwClient,
      walletAddress,
      selectedAccountAddress,
    );
    return valenceAccountClient.pauseService({
      reason: "Paused by valence-ui",
      serviceName: "rebalancer",
    });
  };

  const unpauseRebalancer = async () => {
    const cwClient = await getSigningCosmwasmClient();
    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    const valenceAccountClient = new AccountClient(
      cwClient,
      walletAddress,
      selectedAccountAddress,
    );
    return valenceAccountClient.resumeService({
      serviceName: "rebalancer",
    });
  };

  const { mutate: handlePause, isPending: isPausePending } = useMutation({
    mutationFn: () => pauseRebalancer(),
    onSuccess: (data: ExecuteResult) => {
      toast.success(
        <ToastMessage
          transactionHash={data.transactionHash}
          variant="success"
          title="Rebalancer paused"
        >
          <p className="text-sm">
            You can unpause anytime. No funds will be traded while the
            Rebalancer is paused.
          </p>
        </ToastMessage>,
      );
      queryClient.setQueryData(
        [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, selectedAccountAddress],
        {
          ...config,
          isPaused: true,
        },
      );
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG,
          selectedAccountAddress,
        ],
      });
    },
    onError: (error) => {
      toast.error(
        <ToastMessage variant="error" title="Failed to pause Rebalancer">
          Error: {JSON.stringify(error.message)}
        </ToastMessage>,
      );
    },
  });

  const { mutate: handleUnpause, isPending: isUnpausePending } = useMutation({
    mutationFn: () => unpauseRebalancer(),
    onSuccess: (data: ExecuteResult) => {
      toast.success(
        <ToastMessage
          transactionHash={data.transactionHash}
          variant="success"
          title="Rebalancer resumed."
        >
          <p className="text-sm">
            This Rebalancer account will be included in the next Rebalancer
            cycle.
          </p>
        </ToastMessage>,
      );
      queryClient.setQueryData(
        [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, selectedAccountAddress],
        {
          ...config,
          isPaused: false,
        },
      );
      queryClient.invalidateQueries({
        queryKey: [
          QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG,
          selectedAccountAddress,
        ],
      });
    },
    onError: (error) => {
      toast.error(
        <ToastMessage variant="error" title="Failed to resume Rebalancer">
          Error: {JSON.stringify(error.message)}
        </ToastMessage>,
      );
    },
  });

  return (
    <>
      {" "}
      {!config?.isPaused ? (
        <Button
          isLoading={isPausePending}
          className="h-fit"
          variant="secondary"
          onClick={() => handlePause()}
        >
          Pause
        </Button>
      ) : (
        <Button
          isLoading={isUnpausePending}
          className="h-fit"
          variant="secondary"
          onClick={() => handleUnpause()}
        >
          Unpause
        </Button>
      )}
    </>
  );
};
