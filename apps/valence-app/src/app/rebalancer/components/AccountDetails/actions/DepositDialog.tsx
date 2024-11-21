"use client";
import { ToastMessage } from "@/components";
import {
  Button,
  DialogClose,
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@valence-ui/ui-components";
import { QUERY_KEYS } from "@/const/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet, useWalletBalances } from "@/hooks";
import { toast } from "sonner";
import { InputTableCell, WarnTextV2 } from "@/app/rebalancer/create/components";
import { Fragment, useState } from "react";
import { BalanceReturnValue, useAssetMetadata } from "@/app/rebalancer/hooks";
import { baseToMicro, cn, microToBase } from "@/utils";
import { useForm } from "react-hook-form";
import { Coin, DeliverTxResponse } from "@cosmjs/stargate";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { useAtom } from "jotai";
import { accountAtom } from "@/app/rebalancer/globals";
import { FetchSupportedBalancesReturnValue } from "@/server/actions";
import { SupportedAssets } from "@/app/rebalancer/components";

type DepositInputForm = {
  amounts: Coin[];
};
export const DepositDialog: React.FC<{}> = ({}) => {
  const queryClient = useQueryClient();
  const { address: walletAddress, getSigningStargateClient } = useWallet();
  const [accountAddress] = useAtom(accountAtom);
  const getOriginAsset = useAssetMetadata().getOriginAsset;

  const deposit = async (amounts: DepositInputForm["amounts"]) => {
    const stargateClient = await getSigningStargateClient();

    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    const convertedAmounts = amounts.reduce((acc, coin) => {
      const asset = getOriginAsset(coin.denom);
      const baseAmount = parseFloat(coin.amount);
      if (!asset || baseAmount === 0) {
        return acc;
      }
      return acc.concat({
        denom: coin.denom,
        amount: baseToMicro(baseAmount, asset?.decimals).toString(),
      });
    }, [] as Coin[]);

    return stargateClient.sendTokens(
      walletAddress,
      accountAddress,
      convertedAmounts,
      "auto",
    );
  };
  const { mutate: handleDeposit, isPending: isDepositPending } = useMutation({
    mutationFn: deposit,
    onSuccess: async (
      data: DeliverTxResponse,
      variables: DepositInputForm["amounts"],
    ) => {
      toast.success(
        <ToastMessage
          transactionHash={data.transactionHash}
          title="Deposit completed"
          variant="success"
        ></ToastMessage>,
      );
      queryClient.setQueryData(
        [QUERY_KEYS.ACCOUNT_BALANCES, accountAddress],
        (old: BalanceReturnValue) => {
          return old.map((balance) => {
            const update = variables.find((v) => v.denom === balance.denom);
            if (update) {
              return {
                ...balance,
                amount: balance.amount + parseFloat(update.amount),
              };
            } else return balance;
          });
        },
      );

      setIsDepositDialogOpen(false);
    },
    onError: (error) => {
      ErrorHandler.makeError(ERROR_MESSAGES.SUBMIT_DEPOSIT_FAIL, error);
      toast.error(
        <ToastMessage variant="error" title="Failed to deposit funds">
          Error: {JSON.stringify(error.message)}
        </ToastMessage>,
      );
      setIsDepositDialogOpen(false);
    },
  });

  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  const {
    data: walletBalances, // will be loaded at this stage
  } = useWalletBalances(walletAddress, {
    refetchInveral: 10 * 1000,
  });

  return (
    <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
      <DialogTrigger asChild>
        <Button className="h-fit" variant="secondary">
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-lg flex-col gap-6">
        {
          // to reset when dialog closes
          isDepositDialogOpen && (
            <DepositForm
              walletAddress={walletAddress ?? ""}
              isSubmitPending={isDepositPending}
              handleSubmit={handleDeposit}
              balances={walletBalances ?? []}
            />
          )
        }
      </DialogContent>
    </Dialog>
  );
};

// its own compoennt to refresh the form on each render
const DepositForm: React.FC<{
  isSubmitPending?: boolean;
  handleSubmit: (inputs: DepositInputForm["amounts"]) => void;
  balances: FetchSupportedBalancesReturnValue;
  walletAddress: string;
}> = ({ balances, isSubmitPending, handleSubmit, walletAddress }) => {
  const { getOriginAsset } = useAssetMetadata();

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<DepositInputForm>({
    mode: "onChange",
    defaultValues: {
      amounts: balances.map((lineItem) => ({
        amount: "0",
        denom: lineItem.denom,
      })),
    },
  });
  const isOverMax = !!errors.amounts?.length;

  const convertedNonZeroBalances = balances
    .filter((lineItem) => {
      return parseFloat(lineItem.amount) > 0;
    })
    .map((lineItem) => {
      const asset = getOriginAsset(lineItem.denom);
      return {
        denom: lineItem.denom,
        price: lineItem.price,
        amount: microToBase(parseFloat(lineItem.amount), asset?.decimals ?? 6),
        symbol: asset?.symbol,
      };
    });

  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">Deposit Funds</h1>
        {convertedNonZeroBalances.length === 0 ? (
          <div className="flex flex-col gap-1">
            <p className="text-sm">No valid funds detected.</p>
            <p className="text-sm">
              Transfer one or more supported assets to the wallet:{" "}
              <SupportedAssets />.
            </p>

            <div className="no-wrap flex flex-row items-center justify-end gap-4">
              <DialogClose asChild>
                <Button variant="primary">Close</Button>
              </DialogClose>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <div
                role="grid"
                className="grid grid-cols-[1fr_1fr] justify-items-start gap-x-4 gap-y-2"
              >
                <InputTableCell variant="header">
                  Available funds
                </InputTableCell>
                <InputTableCell variant="header">Deposit Amount</InputTableCell>
                {convertedNonZeroBalances.map((lineItem, index) => {
                  return (
                    <Fragment key={`withdraw-balance-row-${lineItem.denom}`}>
                      <InputTableCell className="flex gap-2">
                        <span>{lineItem.amount}</span>
                        <span>{lineItem.symbol ?? ""}</span>
                      </InputTableCell>
                      <InputTableCell
                        className={cn(
                          "relative flex items-center justify-start border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue",
                          errors.amounts?.[index] && "!border-valence-red",
                        )}
                      >
                        <input
                          placeholder="0.00"
                          className="h-full w-full max-w-[60%]  bg-transparent p-2 font-mono focus:outline-none "
                          type="number"
                          autoFocus={index === 0}
                          {...register(`amounts.${index}.amount`, {
                            valueAsNumber: true,
                            max: {
                              value: lineItem.amount,
                              message: maxLimitMsg,
                            },
                          })}
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono">
                          {lineItem.symbol}
                        </span>
                      </InputTableCell>
                    </Fragment>
                  );
                })}
              </div>
              {isOverMax ? (
                <WarnTextV2 text={maxLimitMsg} variant="error" />
              ) : (
                <div className="min-h-4 w-full"></div>
              )}
            </div>

            <div className="no-wrap flex flex-row items-center justify-end gap-4">
              <DialogClose asChild>
                <Button disabled={isSubmitPending} variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button
                className=""
                isLoading={isSubmitPending}
                onClick={() =>
                  handleSubmit(
                    getValues("amounts").filter((a) => {
                      const num = parseFloat(a.amount);
                      if (isNaN(num) || num <= 0) {
                        return false;
                      }
                      return true;
                    }),
                  )
                }
                disabled={isOverMax}
                variant="primary"
              >
                Deposit
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const maxLimitMsg = "Cannot deposit more than what is in the account";
