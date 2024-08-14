"use client";
import {
  Button,
  ToastMessage,
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components";
import { QUERY_KEYS } from "@/const/query-keys";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks";
import { AccountClient } from "@/codegen/ts-codegen/Account.client";
import { toast } from "sonner";
import { BsExclamationCircle } from "react-icons/bs";
import { UTCDate } from "@date-fns/utc";

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
      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={() => alert("no working yet")}
            className="h-fit"
            variant="secondary"
          >
            Withdraw
          </Button>
        </DialogTrigger>
        {/* <DialogContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Withdraw Funds</h1>
            <p className="text-xs">Select funds to withdraw.</p>
            <UnavailableFundsWarning />
          </div>
          <div className="no-wrap flex flex-row items-center justify-end gap-4">
            <Button variant="secondary">Close</Button>
            <Button variant="primary">Withdraw</Button>
          </div>
        </DialogContent> */}
      </Dialog>

      {actions.map((action) => (
        <Button
          key={`account-action-${action}`}
          className="h-fit"
          variant="secondary"
          onClick={() => alert("no working yet")}
        >
          {action}
        </Button>
      ))}
    </div>
  );
};
const actions = ["Edit"];

const UnavailableFundsWarning: React.FC<{}> = () => {
  const midnightUTC = new UTCDate().setHours(0, 5, 0, 0);
  const formattedDate = new Date(midnightUTC).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    month: "long",
    day: "numeric",
  });
  const [date] = formattedDate.split(", ");

  const finalFormattedDate = `${date}`;
  return (
    <div className="mt-2 flex flex-col gap-2 border border-warn p-4">
      <div className="flex items-center gap-4 ">
        <BsExclamationCircle className="min-h-6 min-w-6 text-warn " />
        <p className="font-base text-swap text-xs text-valence-black">
          {`Some funds are in the middle of a Rebalance cycle. To withdraw all funds, pause the Rebalancer and withdraw after the cycle ends on ${finalFormattedDate}.`}
        </p>
      </div>
    </div>
  );
};
