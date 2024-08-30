import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import React, { Fragment, ReactNode, useCallback } from "react";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { UseFormReturn } from "react-hook-form";
import { displayNumber, displayValue } from "@/utils";
import { produce } from "immer";
import {
  InsufficientFundsWarning,
  useInsufficientFundsWarning,
  InputTableCell,
} from "@/app/rebalancer/create/components";
import { Button, Checkbox, LoadingSkeleton } from "@/components";
import {
  useBaseTokenValue,
  useLivePortfolio,
  useMinimumRequiredValue,
  usePrefetchData,
} from "@/app/rebalancer/hooks";
import { chainConfig } from "@/const/config";

export const SelectAssetsFromAccount: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const { isLoading: isCacheLoading } = usePrefetchData();

  const {
    data: livePortfolio,
    isLoading: isLoadingBalances,
    isFetched: isBalancesFetched,
  } = useLivePortfolio({ accountAddress: address });

  const { setValue, getValues, watch } = form;
  const targets = watch("targets");

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

  const removeTarget = useCallback(
    (denom: string) => {
      const targets = getValues("targets");
      const index = targets.findIndex((t) => t.denom === denom);

      setValue(
        "targets",
        produce(targets, (draft: CreateRebalancerForm["targets"]) => {
          draft.splice(index, 1);
        }),
      );
    },
    [setValue, getValues],
  );

  const baseTokenDenom = watch("baseTokenDenom");

  const { calculateValue, baseTokenAsset } = useBaseTokenValue({
    baseTokenDenom,
  });

  const { isHoldingMinimumFee, isHoldingAtLeastOneAsset } =
    useInsufficientFundsWarning(address);

  if (isLoadingBalances || isCacheLoading)
    return (
      <SelectAmountsLayout
        baseDenom={baseTokenDenom}
        subContent={<LoadingSkeleton className="min-h-56" />}
      ></SelectAmountsLayout>
    );

  if (isBalancesFetched && (!isHoldingMinimumFee || !isHoldingAtLeastOneAsset))
    return (
      <SelectAmountsLayout
        baseDenom={baseTokenDenom}
        subContent={
          <InsufficientFundsWarning
            isEdit={true}
            baseDenom={baseTokenDenom}
            isHoldingAtLeastOneAsset={isHoldingAtLeastOneAsset}
          />
        }
      ></SelectAmountsLayout>
    );

  return (
    <SelectAmountsLayout baseDenom={baseTokenDenom}>
      <div className="flex max-w-[90%] flex-row gap-20">
        <div
          role="grid"
          className="grid grid-cols-[2fr_1fr_1fr] justify-items-start gap-x-8 gap-y-2"
        >
          <InputTableCell variant="header">
            Funds in rebalancer account
          </InputTableCell>
          <InputTableCell variant="header">Value (USD)</InputTableCell>
          <InputTableCell variant="header">Added to Rebalancer</InputTableCell>

          {livePortfolio?.balances
            ?.filter((lineItem) => {
              return lineItem.balance.account > 0;
            })
            .map((lineItem) => {
              let amount = lineItem.balance.account;

              const value = calculateValue({
                denom: lineItem.denom,
                amount: amount,
              });

              const valueDisplayString = displayValue({
                value: value,
                symbol: baseTokenAsset?.symbol ?? "USDC",
              });

              const target = targets.find((t) => t.denom === lineItem.denom);
              return (
                <Fragment key={`wallet-balance-row-${lineItem.denom}`}>
                  <InputTableCell className="flex gap-2">
                    <span>{displayNumber(amount, { precision: 2 })}</span>
                    <span>{lineItem.symbol}</span>
                  </InputTableCell>

                  <InputTableCell>{valueDisplayString}</InputTableCell>
                  <InputTableCell>
                    <Checkbox
                      checked={!!target}
                      onChange={(value) => {
                        if (!!value) {
                          addTarget(lineItem.denom);
                        } else removeTarget(lineItem.denom);
                      }}
                    />
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
          {CreateRebalancerCopy.step_edit_SelectAssets.title}
        </h1>
        <p className="w-3/4 text-sm">
          {CreateRebalancerCopy.step_edit_SelectAssets.subTitle}
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
