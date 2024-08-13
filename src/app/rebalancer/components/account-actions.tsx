"use client";
import { Button, ToastMessage } from "@/components";
import { QUERY_KEYS } from "@/const/query-keys";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks";
import { AccountClient } from "@/codegen/ts-codegen/Account.client";
import { toast } from "sonner";

export const AccountActions: React.FC<{
  config?: FetchAccountConfigReturnValue;
  valenceAccountAddress: string;
}> = ({ config, valenceAccountAddress }) => {
  const { address: walletAddress, getSigningCosmwasmClient } = useWallet();

  // admin does pause on the account contract, and trustee does pause on the rebalancer contract
  const pauseRebalancer = async () => {
    const cwClient = await getSigningCosmwasmClient();
    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    const valenceAccountClient = new AccountClient(
      cwClient,
      walletAddress,
      valenceAccountAddress,
    );
    return valenceAccountClient.pauseService({
      reason: "Paused by valence-ui",
      serviceName: "rebalancer",
    });
  };

  const queryClient = useQueryClient();

  // admin does pause on the account contract, and trustee does pause on the rebalancer contract
  const { mutate: handlePause, isPending: isPausePending } = useMutation({
    mutationFn: () => pauseRebalancer(),
    onSuccess: () => {
      toast.success(
        <ToastMessage variant="success" title="Rebalancer paused">
          You can unpause anytime. No funds will be traded while the Rebalancer
          is paused.
        </ToastMessage>,
      );
      queryClient.setQueryData(
        [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, valenceAccountAddress],
        {
          ...config,
          isPaused: true,
        },
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, valenceAccountAddress],
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
  const unpauseRebalancer = async () => {
    const cwClient = await getSigningCosmwasmClient();
    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    const valenceAccountClient = new AccountClient(
      cwClient,
      walletAddress,
      valenceAccountAddress,
    );
    return valenceAccountClient.resumeService({
      serviceName: "rebalancer",
    });
  };

  const { mutate: handleUnpause, isPending: isUnpausePending } = useMutation({
    mutationFn: () => unpauseRebalancer(),
    onSuccess: () => {
      toast.success(
        <ToastMessage variant="success" title="Rebalancer resumed" />,
      );
      queryClient.setQueryData(
        [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, valenceAccountAddress],
        {
          ...config,
          isPaused: false,
        },
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, valenceAccountAddress],
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

  if (!config) return;
  return (
    <div className="flex flex-row flex-nowrap gap-2 ">
      {!config.isPaused ? (
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

      {actions.map((action) => (
        <Button
          key={`account-action-${action}`}
          className="h-fit"
          variant="secondary"
          onClick={() => alert("got em")}
        >
          {action}
        </Button>
      ))}
    </div>
  );
};
const actions = ["Edit", "Withdraw"];
