import {
  CreateRebalancerCopy,
  RebalancerFormTooltipCopy,
} from "@/app/rebalancer/create/copy";
import React, { Fragment, ReactNode, useCallback } from "react";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { UseFormReturn } from "react-hook-form";
import { useWallet, useWalletBalances } from "@/hooks";
import { cn, displayNumber, displayValue, microToBase } from "@/utils";
import { produce } from "immer";
import { FormTableCell, WarnTextV2 } from "@/app/rebalancer/create/components";
import { CalloutBox, Checkbox, LoadingSkeleton } from "@/components";
import {
  FormTextInput,
  FormField,
  IconTooltipContent,
  InputLabel,
  WithIconAndTooltip,
} from "@valence-ui/ui-components";
import {
  useAssetMetadata,
  useBaseTokenValue,
  useMinimumRequiredValue,
  useNoSupportedAssetsWarning,
} from "@/app/rebalancer/hooks";
import { chainConfig } from "@/const/config";
import { BsExclamationCircle } from "react-icons/bs";
import {
  Asset,
  NoFundsActionItems,
  SupportedAssets,
} from "@/app/rebalancer/components";

export const DepositAssets: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const {
    data: balances,
    isLoading: isLoadingBalances,
    isFetched: isBalancesFetched,
  } = useWalletBalances(address, {
    refetchInveral: 10 * 1000,
  });
  const { setValue, getValues, watch } = form;
  const { isWalletConnected } = useWallet();

  const addTarget = useCallback(
    (denom: string) => {
      const targets = getValues("targets");
      const existingI = targets.findIndex((t) => t.denom === denom);
      if (existingI > -1) return;
      const withAdditionalTarget = produce(
        targets,
        (draft: CreateRebalancerForm["targets"]) => {
          draft.push({
            denom,
            bps: 0,
          });
        },
      );
      setValue("targets", withAdditionalTarget);
    },
    [setValue, getValues],
  );

  const baseTokenDenom = watch("baseTokenDenom");
  const initialAmounts = watch("initialAssets");

  const { calculateValue, baseTokenAsset } = useBaseTokenValue({
    baseTokenDenom,
  });

  const { getOriginAsset } = useAssetMetadata();
  const isServiceFeeIncluded = form.watch("isServiceFeeIncluded");

  const { isHoldingMinimumFee, isHoldingAtLeastOneAsset } =
    useNoSupportedAssetsWarning(address);

  const totalDepositValue = initialAmounts?.reduce((acc, balance) => {
    const value = calculateValue({
      denom: balance.denom,
      amount: balance.startingAmount,
    });
    return acc + value;
  }, 0);

  // little redundant as this is done again below, but easier to read this way
  const totalAccountValue =
    balances?.reduce((acc, balance) => {
      const asset = getOriginAsset(balance.denom);
      return (
        acc +
        calculateValue({
          denom: balance.denom,
          amount: microToBase(balance.amount, asset?.decimals ?? 0),
        })
      );
    }, 0) ?? 0;

  const { value: totalRequiredValue, symbol: requiredValueSymbol } =
    useMinimumRequiredValue(baseTokenDenom ?? "");

  const isAccountHoldingMinumumValue = totalAccountValue >= totalRequiredValue;

  const minimumValueDisplayString = displayValue({
    value: totalRequiredValue,
    symbol: requiredValueSymbol,
  });

  if (isLoadingBalances)
    return (
      <DepositAssetsLayout
        baseDenom={baseTokenDenom}
        subContent={<LoadingSkeleton className="min-h-56" />}
      ></DepositAssetsLayout>
    );

  if (!isWalletConnected) {
    return (
      <DepositAssetsLayout
        baseDenom={baseTokenDenom}
        subContent={
          <div className="mt-2 flex flex-row items-center gap-4 border border-warn p-4">
            <BsExclamationCircle className="h-8 w-8 text-warn " />
            <div className="flex flex-col gap-0.5">
              <WarnTextV2 variant="warn" text="No wallet connected." />
              <p className="text-sm">Connect a wallet to continue.</p>
            </div>
          </div>
        }
      />
    );
  }
  if (isBalancesFetched && !isHoldingAtLeastOneAsset)
    return (
      <DepositAssetsLayout
        baseDenom={baseTokenDenom}
        subContent={
          <>
            {!isHoldingAtLeastOneAsset && (
              <CalloutBox
                variant="warn"
                title="This wallet does not hold any assets supported by the Rebalancer."
                text={`Deposit at least one supported asset and ${chainConfig.serviceFee.amount} ${chainConfig.serviceFee.symbol} for the service fee.`}
              >
                <NoFundsActionItems />
              </CalloutBox>
            )}
          </>
        }
      ></DepositAssetsLayout>
    );

  return (
    <DepositAssetsLayout
      baseDenom={baseTokenDenom}
      subContent={
        <div className="flex flex-col gap-2">
          {(!isHoldingMinimumFee || !isAccountHoldingMinumumValue) && (
            <CalloutBox
              variant="error"
              title={`Wallet does not meet the minimum requirements.`}
            >
              {!isHoldingMinimumFee && (
                <p>
                  <span className="font-semibold"> Missing service fee: </span>
                  deposit {chainConfig.serviceFee.amount}{" "}
                  {chainConfig.serviceFee.symbol} into the wallet.
                </p>
              )}
              {!isAccountHoldingMinumumValue && (
                <p>
                  This wallet holds less than {minimumValueDisplayString} in
                  value. A minimum deposit value of {minimumValueDisplayString}{" "}
                  is required to enable rebalancing. Please transfer additional
                  funds to the wallet.
                </p>
              )}
            </CalloutBox>
          )}
        </div>
      }
    >
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          disabled={!isHoldingMinimumFee}
          checked={isServiceFeeIncluded}
          onChange={(value) => setValue("isServiceFeeIncluded", value)}
        />
        <WithIconAndTooltip
          tooltipContent={
            <IconTooltipContent {...RebalancerFormTooltipCopy.serviceFee} />
          }
        >
          <span className="text-sm">
            Accept service fee of {chainConfig.serviceFee.amount}{" "}
            {chainConfig.serviceFee.symbol}
          </span>
        </WithIconAndTooltip>
      </div>

      <div className="flex max-w-[90%] flex-col gap-2">
        <div
          role="grid"
          className="grid grid-cols-[1fr_1fr_1fr_2fr_1fr] justify-items-start gap-x-8 gap-y-2"
        >
          <InputLabel label="Asset" />

          <InputLabel label="Amount available" />

          <InputLabel label="Total value" />

          <InputLabel label="Initial Deposit" />

          <InputLabel label="Deposit Value" />

          {balances
            ?.filter((b) => {
              const asset = getOriginAsset(b.denom);
              return !!asset;
            })
            ?.map((balance, index) => {
              const asset = getOriginAsset(balance.denom);

              let baseBalance = 0;
              if (asset) {
                baseBalance = microToBase(balance.amount, asset.decimals);
              }
              if (
                asset?.denom === chainConfig.serviceFee.denom &&
                isServiceFeeIncluded
              ) {
                baseBalance -= chainConfig.serviceFee.amount;
              }

              const totalValue = calculateValue({
                denom: balance.denom,
                amount: baseBalance,
              });

              const toalValueDisplayString = displayValue({
                value: totalValue,
                symbol: baseTokenAsset?.symbol ?? "USDC",
              });

              const selectedAmount = getValues(
                `initialAssets.${index}.startingAmount`,
              );

              const selectedValue = calculateValue({
                denom: balance.denom,
                amount: selectedAmount,
              });

              const selectedValueDisplayString = displayValue({
                value: selectedValue,
                symbol: baseTokenAsset?.symbol ?? "USDC",
              });
              const isOverMax = Number(selectedAmount ?? 0) > baseBalance;

              return (
                <Fragment key={`wallet-balance-row-${balance.denom}`}>
                  <FormTableCell className="flex flex-row items-center gap-2">
                    <Asset symbol={asset?.symbol} asChild />
                  </FormTableCell>

                  <FormTableCell
                    className={cn(
                      "flex gap-2",
                      isOverMax && "text-valence-red",
                    )}
                  >
                    <span>{displayNumber(baseBalance, { precision: 2 })}</span>
                  </FormTableCell>

                  <FormTableCell>{toalValueDisplayString}</FormTableCell>

                  <FormTableCell>
                    <FormField name={`initialAssets.${index}.startingAmount`}>
                      <FormTextInput
                        isError={isOverMax}
                        placeholder="0.00"
                        type="number"
                        autoFocus={index === 0}
                        value={watch(`initialAssets.${index}.startingAmount`)}
                        onChange={(e) => {
                          e.preventDefault();
                          const amount = parseFloat(e.target.value);
                          setValue(`initialAssets.${index}`, {
                            startingAmount: amount,
                            symbol: asset?.symbol ?? "",
                            denom: balance.denom,
                          });

                          if (amount > 0) {
                            addTarget(balance.denom);
                          }
                        }}
                        suffix={asset?.symbol}
                        containerClassName="w-full"
                      />
                    </FormField>
                  </FormTableCell>

                  <FormTableCell>
                    {isOverMax ? (
                      <>{toalValueDisplayString}</>
                    ) : (
                      <>{selectedValueDisplayString}</>
                    )}
                  </FormTableCell>
                </Fragment>
              );
            })}
        </div>

        {balances
          ?.filter((b) => {
            const asset = getOriginAsset(b.denom);
            return !!asset;
          })
          ?.some((balance, index) => {
            const asset = getOriginAsset(balance.denom);

            let baseBalance = 0;
            if (asset) {
              baseBalance = microToBase(balance.amount, asset.decimals);
            }
            if (
              asset?.denom === chainConfig.serviceFee.denom &&
              isServiceFeeIncluded
            ) {
              baseBalance -= chainConfig.serviceFee.amount;
            }
            const selectedAmount = getValues(
              `initialAssets.${index}.startingAmount`,
            );
            const isOverMax = Number(selectedAmount ?? 0) > baseBalance;
            return isOverMax;
          }) && (
          <WarnTextV2
            variant="error"
            text="Deposit greater than available funds."
          />
        )}
        {initialAmounts?.length > 0 &&
          initialAmounts.some(
            (a) => a.startingAmount && a.startingAmount > 0,
          ) &&
          totalDepositValue < totalRequiredValue && (
            <WarnTextV2
              variant="warn"
              text={`Minumum deposit must be at least ${minimumValueDisplayString} in value.`}
            />
          )}
      </div>
    </DepositAssetsLayout>
  );
};

const DepositAssetsLayout: React.FC<{
  children?: ReactNode;
  subContent?: React.ReactNode;
  baseDenom?: string;
}> = ({ children, subContent, baseDenom }) => {
  const { value, symbol } = useMinimumRequiredValue(baseDenom ?? "");

  const minimumValueDisplayString = displayValue({ value, symbol });

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_SelectAssets.title}
        </h1>
        <p className=" text-sm">
          {CreateRebalancerCopy.step_SelectAssets.subTitle}
        </p>
        <p className=" text-sm">
          Account must hold a minimum value of {minimumValueDisplayString} to
          enable rebalancing. Supported assets are: <SupportedAssets />.
        </p>
        {subContent}
      </div>
      {children}
    </section>
  );
};
