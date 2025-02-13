"use client";
import { useAtom } from "jotai";
import { useAccountConfigQuery } from "@/app/rebalancer/ui";
import {
  Button,
  LinkText,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import { QUERY_KEYS } from "@/const/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks";
import { AccountClient } from "@valence-ui/generated-types/dist/cosmwasm/types/Account.client";
import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { CelatoneUrl } from "@/const";
import { useQueryState } from "nuqs";

export const PauseOrUnpauseButton: React.FC<{}> = () => {
  const queryClient = useQueryClient();
  const { address: walletAddress, getSigningCosmwasmClient } = useWallet();
  const [selectedAccountAddress] = useQueryState("account", {
    defaultValue: "",
  });
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
    onSuccess: (result: ExecuteResult) => {
      toast.success(
        <ToastMessage variant="success" title="Rebalancer paused">
          <p>
            You can unpause anytime. No funds will be traded while the
            Rebalancer is paused.
          </p>
          <p>
            Transaction hash:{" "}
            <LinkText
              variant={"secondary"}
              blankTarget={true}
              href={CelatoneUrl.transaction(result.transactionHash)}
            >
              {result.transactionHash}
            </LinkText>
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
    onSuccess: (result: ExecuteResult) => {
      toast.success(
        <ToastMessage variant="success" title="Rebalancer resumed.">
          <p>
            This Rebalancer account will be included in the next Rebalancer
            cycle.
          </p>
          <p>
            Transaction hash:{" "}
            <LinkText
              variant={"secondary"}
              blankTarget={true}
              href={CelatoneUrl.transaction(result.transactionHash)}
            >
              {result.transactionHash}
            </LinkText>
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
