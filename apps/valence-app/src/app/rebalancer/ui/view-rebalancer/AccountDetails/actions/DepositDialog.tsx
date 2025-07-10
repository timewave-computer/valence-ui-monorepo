"use client";
import {
  Button,
  DialogClose,
  Dialog,
  DialogTrigger,
  DialogContent,
  InputLabel,
  FormField,
  FormRoot,
  FormControl,
  TextInput,
  InfoText,
  TableCell,
  LinkText,
  ToastMessage,
  toast,
  Heading,
} from "@valence-ui/ui-components";
import { QUERY_KEYS } from "@/const/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fragment, useState } from "react";
import { baseToMicro, displayNumberV2, microToBase } from "@/utils";
import { useForm } from "react-hook-form";
import { Coin, DeliverTxResponse } from "@cosmjs/stargate";
import { ERROR_MESSAGES, ErrorHandler } from "@/const/error";
import {
  BalanceReturnValue,
  useAssetMetadata,
  SupportedAssets,
  useRebalancerAssetBalances,
} from "@/app/rebalancer/ui";
import { FetchSupportedBalancesReturnValue } from "@/server/actions";
import { CelatoneUrl, chainConfig } from "@/const";
import { useQueryState } from "nuqs";
import { useAccount, useStargateSigningClient } from "graz";

type DepositInputForm = {
  amounts: Coin[];
};
export const DepositDialog: React.FC<{}> = ({}) => {
  const queryClient = useQueryClient();
  const { data: account } = useAccount({ chainId: chainConfig.chain.chain_id });
  const { data: signingStargateClient } = useStargateSigningClient();
  const walletAddress = account?.bech32Address;
  const [accountAddress] = useQueryState("account", {
    defaultValue: "",
  });
  const getOriginAsset = useAssetMetadata().getOriginAsset;

  const deposit = async (amounts: DepositInputForm["amounts"]) => {
    if (!walletAddress) {
      throw new Error("No wallet address found"); // should not happen
    }
    if (!signingStargateClient) {
      throw new Error("No signing client found");
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

    return signingStargateClient.sendTokens(
      walletAddress,
      accountAddress,
      convertedAmounts,
      "auto",
    );
  };
  const { mutate: handleDeposit, isPending: isDepositPending } = useMutation({
    mutationFn: deposit,
    onSuccess: async (
      result: DeliverTxResponse,
      variables: DepositInputForm["amounts"],
    ) => {
      toast.success(
        <ToastMessage title="Deposit completed" variant="success">
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
  } = useRebalancerAssetBalances(walletAddress, {
    refetchInveral: 10 * 1000,
  });

  return (
    <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
      <DialogTrigger asChild>
        <Button className="h-fit" variant="secondary">
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4">
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
export const DepositForm: React.FC<{
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
        <Heading level="h2">Deposit Funds</Heading>
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
            <FormRoot
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-1"
            >
              <div
                role="grid"
                className="grid grid-cols-[1fr_2fr] justify-items-start gap-x-4 gap-y-2"
              >
                <InputLabel noGap size="sm" label="Available funds" />
                <InputLabel noGap size="sm" label="Deposit Amount" />

                {convertedNonZeroBalances.map((lineItem, index) => {
                  return (
                    <Fragment key={`withdraw-balance-row-${lineItem.denom}`}>
                      <TableCell
                        variant="input"
                        align="left"
                        className="flex gap-2"
                      >
                        {displayNumberV2(lineItem.amount, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 10,
                        })}{" "}
                        {lineItem.symbol ?? ""}
                      </TableCell>
                      <TableCell variant="input" align="left">
                        <FormField asChild name={`amounts.${index}.amount`}>
                          <FormControl asChild>
                            <TextInput
                              size="sm"
                              isError={!!errors.amounts?.[index]}
                              suffix={lineItem.symbol}
                              autoFocus={index === 0}
                              {...register(`amounts.${index}.amount`, {
                                valueAsNumber: true,
                                max: {
                                  value: lineItem.amount,
                                  message: maxLimitMsg,
                                },
                              })}
                              type="number"
                              placeholder="0.00"
                            />
                          </FormControl>
                        </FormField>
                      </TableCell>
                    </Fragment>
                  );
                })}
              </div>
              {isOverMax && <InfoText variant="warn">{maxLimitMsg} </InfoText>}
            </FormRoot>

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
