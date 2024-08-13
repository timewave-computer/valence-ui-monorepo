import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import React, { Fragment, ReactNode, useCallback } from "react";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { UseFormReturn } from "react-hook-form";
import { useSupportedBalances } from "@/hooks";
import { displayNumber, displayValue, microToBase } from "@/utils";
import { produce } from "immer";
import {
  InsufficientFundsWarning,
  useInsufficientFundsWarning,
  InputTableCell,
} from "@/app/rebalancer/create/components";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import {
  useAssetCache,
  useBaseTokenValue,
  usePrefetchData,
} from "@/app/rebalancer/hooks";

export const SelectAmounts: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const {
    data: balances,
    isLoading: isLoadingBalances,
    isFetched: isBalancesFetched,
  } = useSupportedBalances(address);
  const { setValue, getValues, watch } = form;

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

  const { calculateValue, baseTokenAsset } = useBaseTokenValue({
    baseTokenDenom,
  });

  const { getAsset } = useAssetCache();

  const { isHoldingMinimumFee, isHoldingAtLeastOneAsset } =
    useInsufficientFundsWarning(address);

  if (isLoadingBalances || isCacheLoading)
    return (
      <SelectAmountsLayout showSubtitle={false}>
        <LoadingSkeleton className="min-h-56" />
      </SelectAmountsLayout>
    );

  if (isBalancesFetched && (!isHoldingMinimumFee || !isHoldingAtLeastOneAsset))
    return (
      <SelectAmountsLayout showSubtitle={false}>
        <InsufficientFundsWarning
          isHoldingAtLeastOneAsset={true}
          isHoldingMinimumFee={true}
        />
      </SelectAmountsLayout>
    );

  return (
    <SelectAmountsLayout>
      <div className="flex max-w-[90%] flex-row gap-20">
        <div
          role="grid"
          className="grid grid-cols-[1fr_1fr_2fr_2fr] justify-items-start gap-x-8 gap-y-2"
        >
          <InputTableCell variant="header">Available funds</InputTableCell>
          <InputTableCell variant="header">Value (USD)</InputTableCell>
          <InputTableCell className="justify-start" variant="header">
            Initial Amounts
          </InputTableCell>
          <InputTableCell variant="header">Initial Value</InputTableCell>
          {balances
            ?.filter((b) => {
              const asset = getAsset(b.denom);
              return !!asset;
            })
            ?.map((balance, index) => {
              const asset = getAsset(balance.denom);

              let baseBalance = 0;
              if (asset) {
                baseBalance = microToBase(balance.amount, asset.decimals);
              }
              const allValueDisplayString = displayValue({
                value: baseBalance * balance.price,
                symbol: "USDC", // always value in usd for first section, for now
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
              return (
                <Fragment key={`wallet-balance-row-${balance.denom}`}>
                  <InputTableCell className="flex gap-2">
                    <span>{displayNumber(baseBalance, { precision: 2 })}</span>
                    <span>{asset?.symbol ?? ""}</span>
                  </InputTableCell>

                  <InputTableCell>({allValueDisplayString})</InputTableCell>

                  <InputTableCell className="relative flex items-center justify-start border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue">
                    <input
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
                    ({selectedValueDisplayString})
                  </InputTableCell>
                </Fragment>
              );
            })}
        </div>
      </div>
    </SelectAmountsLayout>
  );
};

const SelectAmountsLayout: React.FC<{
  children: ReactNode;
  showSubtitle?: boolean;
}> = ({ children, showSubtitle = true }) => {
  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_SelectAssets.title}
        </h1>
        {showSubtitle && (
          <p className="w-3/4 text-sm">
            {CreateRebalancerCopy.step_SelectAssets.subTitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
};
