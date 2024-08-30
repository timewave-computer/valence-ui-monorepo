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
import {
  InsufficientFundsWarning,
  useInsufficientFundsWarning,
  InputTableCell,
  WarnTextV2,
  MissingServiceFeeWarning,
} from "@/app/rebalancer/create/components";
import {
  Checkbox,
  LoadingSkeleton,
  QuestionTooltipContent,
  WithQuestionTooltip,
} from "@/components";
import {
  useAssetCache,
  useBaseTokenValue,
  useMinimumRequiredValue,
  usePrefetchData,
} from "@/app/rebalancer/hooks";
import { chainConfig } from "@/const/config";
import { BsExclamationCircle } from "react-icons/bs";
import { get } from "lodash";

export const SelectAmounts: React.FC<{
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
  const { isLoading: isCacheLoading } = usePrefetchData();
  const baseTokenDenom = watch("baseTokenDenom");
  const initialAmounts = watch("initialAssets");

  const { calculateValue, baseTokenAsset } = useBaseTokenValue({
    baseTokenDenom,
  });

  const { getOriginAsset } = useAssetCache();
  const isServiceFeeIncluded = form.watch("isServiceFeeIncluded");

  const { isHoldingMinimumFee, isHoldingAtLeastOneAsset } =
    useInsufficientFundsWarning(address);

  const totalDepositValue = initialAmounts?.reduce((acc, balance) => {
    const value = calculateValue({
      denom: balance.denom,
      amount: balance.startingAmount,
    });
    return acc + value;
  }, 0);

  const { value: totalRequiredValue, symbol: requiredValueSymbol } =
    useMinimumRequiredValue(baseTokenDenom ?? "");
  const minimumValueDisplayString = displayValue({
    value: totalRequiredValue,
    symbol: requiredValueSymbol,
  });

  if (isLoadingBalances || isCacheLoading)
    return (
      <SelectAmountsLayout
        baseDenom={baseTokenDenom}
        subContent={<LoadingSkeleton className="min-h-56" />}
      ></SelectAmountsLayout>
    );

  if (!isWalletConnected) {
    return (
      <SelectAmountsLayout
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
      <SelectAmountsLayout
        baseDenom={baseTokenDenom}
        subContent={
          <InsufficientFundsWarning
            baseDenom={baseTokenDenom}
            isHoldingAtLeastOneAsset={isHoldingAtLeastOneAsset}
          />
        }
      ></SelectAmountsLayout>
    );

  return (
    <SelectAmountsLayout
      baseDenom={baseTokenDenom}
      subContent={<>{!isHoldingMinimumFee && <MissingServiceFeeWarning />}</>}
    >
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          disabled={!isHoldingMinimumFee}
          checked={isServiceFeeIncluded}
          onChange={(value) => setValue("isServiceFeeIncluded", value)}
        />
        <WithQuestionTooltip
          tooltipContent={
            <QuestionTooltipContent {...RebalancerFormTooltipCopy.serviceFee} />
          }
        >
          <span className="text-sm">
            Accept service fee of {chainConfig.serviceFee.amount}{" "}
            {chainConfig.serviceFee.symbol}
          </span>
        </WithQuestionTooltip>
      </div>

      <div className="flex max-w-[90%] flex-col gap-2">
        <div
          role="grid"
          className="grid grid-cols-[1fr_1fr_2fr_2fr] justify-items-start gap-x-8 gap-y-2"
        >
          <InputTableCell variant="header">Available funds</InputTableCell>
          <InputTableCell variant="header">Total value</InputTableCell>
          <InputTableCell className="justify-start" variant="header">
            Initial Deposit
          </InputTableCell>
          <InputTableCell variant="header">Deposit Value</InputTableCell>
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
                  <InputTableCell
                    className={cn(
                      "flex gap-2",
                      isOverMax && "text-valence-red",
                    )}
                  >
                    <span>{displayNumber(baseBalance, { precision: 2 })}</span>
                    <span>{asset?.symbol ?? ""}</span>
                  </InputTableCell>

                  <InputTableCell>{toalValueDisplayString}</InputTableCell>

                  <InputTableCell
                    className={cn(
                      "relative flex items-center justify-start border-[1.5px] border-valence-lightgray bg-valence-lightgray",
                      "focus-within:border-valence-blue",
                      isOverMax &&
                        "border-valence-red focus-within:border-valence-red",
                    )}
                  >
                    <input
                      // @ts-ignore
                      onWheel={(e) => e.target?.blur()} // prevent scroll
                      placeholder="0.00"
                      className="h-full w-full max-w-[60%]  bg-transparent p-2 font-mono focus:outline-none  "
                      type="number"
                      autoFocus={index === 0}
                      value={watch(`initialAssets.${index}.startingAmount`)}
                      onChange={(e) => {
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
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono">
                      {asset?.symbol}
                    </span>
                  </InputTableCell>

                  <InputTableCell variant="number">
                    {isOverMax ? (
                      <>{toalValueDisplayString}</>
                    ) : (
                      <>{selectedValueDisplayString}</>
                    )}
                  </InputTableCell>
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
    </SelectAmountsLayout>
  );
};

const SelectAmountsLayout: React.FC<{
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
          enable rebalancing. Supported assets are:{" "}
          {chainConfig.supportedAssets.map((a, i) => {
            return (
              <>
                {" "}
                <span className="font-semibold">{a.symbol}</span>
                {i !== chainConfig.supportedAssets.length - 1 && ", "}
              </>
            );
          })}
          .
        </p>
        {subContent}
      </div>
      {children}
    </section>
  );
};
