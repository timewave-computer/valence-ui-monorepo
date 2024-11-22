"use client";
import { ToastMessage } from "@/components";
import {
  Button,
  DialogClose,
  Dialog,
  DialogTrigger,
  DialogContent,
  FormRoot,
  FormInputLabel,
  FormField,
  FormTextInput,
  FormTableCell,
} from "@valence-ui/ui-components";
import { QUERY_KEYS } from "@/const/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/hooks";
import { AccountClient } from "@valence-ui/generated-types/dist/cosmwasm/types/Account.client";
import { toast } from "sonner";
import { Fragment, useState } from "react";
import {
  BalanceReturnValue,
  useAccountConfigQuery,
  useAssetMetadata,
  useLivePortfolio,
  UseLivePortfolioReturnValue,
} from "@/app/rebalancer/hooks";
import { baseToMicro, displayNumber, displayNumberV2 } from "@/utils";
import { useForm } from "react-hook-form";
import { Coin } from "@cosmjs/stargate";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import { UTCDate } from "@date-fns/utc";
import { BsExclamationCircle } from "react-icons/bs";
import { useAtom } from "jotai";
import { accountAtom } from "@/app/rebalancer/globals";
import { WarnTextV2 } from "@/app/rebalancer/create/components";

type WithdrawInputForm = {
  amounts: Coin[];
};
export const WithdrawDialog: React.FC<{}> = ({}) => {
  const queryClient = useQueryClient();
  const { getOriginAsset } = useAssetMetadata();
  const { address: walletAddress, getSigningCosmwasmClient } = useWallet();
  const [accountAddress] = useAtom(accountAtom);
  const { data: config } = useAccountConfigQuery({ account: accountAddress });
  const livePortfolioQuery = useLivePortfolio({
    accountAddress: accountAddress,
  });

  const isFundsInAuction = livePortfolioQuery.data?.balances.some(
    (lineItem) => {
      return lineItem.balance.auction > 0;
    },
  );

  const withdraw = async (amounts: WithdrawInputForm["amounts"]) => {
    const signer = await getSigningCosmwasmClient();

    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    const accountClient = new AccountClient(
      signer,
      walletAddress,
      accountAddress,
    );
    return accountClient.executeByAdmin({
      msgs: [
        {
          bank: {
            send: {
              amount: amounts.map((a) => {
                const asset = getOriginAsset(a.denom);
                if (!asset)
                  // should not happen but we should handle
                  throw ErrorHandler.makeError(
                    ERROR_MESSAGES.SUBMIT_WITHDRAW_CACHE_FAIL,
                  );
                return {
                  amount: baseToMicro(a.amount, asset.decimals).toString(),
                  denom: a.denom,
                };
              }),
              to_address: walletAddress,
            },
          },
        },
      ],
    });
  };
  const { mutate: handleWithdraw, isPending: isWithdrawPending } = useMutation({
    mutationFn: withdraw,
    onSuccess: async (data, variables: WithdrawInputForm["amounts"]) => {
      toast.success(
        <ToastMessage
          transactionHash={data.transactionHash}
          title="Withdraw completed"
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
                amount: balance.amount - parseFloat(update.amount),
              };
            } else return balance;
          });
        },
      );

      setIsWithdrawDialogOpen(false);
    },
    onError: (error) => {
      ErrorHandler.makeError(ERROR_MESSAGES.SUBMIT_WITHDRAW_FAIL, error);
      toast.error(
        <ToastMessage variant="error" title="Failed to withdraw funds">
          Error: {JSON.stringify(error.message)}
        </ToastMessage>,
      );
      setIsWithdrawDialogOpen(false);
    },
  });

  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);

  return (
    <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
      <DialogTrigger asChild>
        <Button className="h-fit" variant="secondary">
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-w-lg flex-col gap-6">
        {
          // to reset when dialog closes
          isWithdrawDialogOpen && (
            <WithdrawForm
              isSubmitPending={isWithdrawPending}
              handleSubmit={handleWithdraw}
              isFundsInAuction={isFundsInAuction}
              balances={livePortfolioQuery.data?.balances}
            />
          )
        }
      </DialogContent>
    </Dialog>
  );
};

// its own compoennt to refresh the form on each render
const WithdrawForm: React.FC<{
  isSubmitPending?: boolean;
  handleSubmit: (inputs: WithdrawInputForm["amounts"]) => void;
  balances: UseLivePortfolioReturnValue["data"]["balances"];
  isFundsInAuction: boolean;
}> = ({ balances, isFundsInAuction, isSubmitPending, handleSubmit }) => {
  const { getOriginAsset } = useAssetMetadata();

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<WithdrawInputForm>({
    mode: "onChange",
    defaultValues: {
      amounts: balances.map((lineItem) => ({
        amount: "0",
        denom: lineItem.denom,
      })),
    },
  });
  const isOverMax = !!errors.amounts?.length;

  const nonZeroBalances = balances.filter((lineItem) => {
    return lineItem.balance.total > 0;
  });
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">Withdraw Funds</h1>
        {isFundsInAuction && <UnavailableFundsWarning />}
      </div>
      {nonZeroBalances.length === 0 ? (
        <>
          {" "}
          <p>Account is empty, no funds to withdraw.</p>
          <div className="no-wrap flex flex-row items-center justify-end gap-4">
            <DialogClose asChild>
              <Button variant="primary">Close</Button>
            </DialogClose>
          </div>
        </>
      ) : (
        <FormRoot onSubmit={(e) => e.preventDefault()}>
          <div
            role="grid"
            className="grid grid-cols-[1fr_1fr] justify-items-start gap-x-4 gap-y-2"
          >
            <FormInputLabel label="Available funds" />
            <FormInputLabel label="Withdraw Amount" />

            {nonZeroBalances.map((lineItem, index) => {
              const asset = getOriginAsset(lineItem.denom);
              return (
                <Fragment key={`withdraw-balance-row-${lineItem.denom}`}>
                  <FormTableCell className="flex gap-2">
                    {displayNumberV2(lineItem.balance.account, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 10,
                    })}{" "}
                    {asset?.symbol ?? ""}
                  </FormTableCell>
                  <FormTableCell>
                    <FormField
                      name={`amounts.${index}.amount`}
                      className="flex flex-col gap-1"
                    >
                      <FormTextInput
                        type="number"
                        suffix={asset?.symbol}
                        placeholder="0.00"
                        autoFocus={index === 0}
                        {...register(`amounts.${index}.amount`, {
                          valueAsNumber: true,
                          max: {
                            value: lineItem.balance.account,
                            message: maxLimitMsg,
                          },
                        })}
                      />
                    </FormField>
                  </FormTableCell>
                </Fragment>
              );
            })}

            {isOverMax ? (
              <WarnTextV2 text={maxLimitMsg} variant="warn" />
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
              Withdraw
            </Button>
          </div>
        </FormRoot>
      )}
    </>
  );
};

const maxLimitMsg = "Cannot withdraw more than what is in the account";
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
