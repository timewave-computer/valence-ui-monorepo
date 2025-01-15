import React, { Fragment, ReactNode, useCallback } from "react";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { UseFormReturn } from "react-hook-form";
import { displayNumber, displayValue } from "@/utils";
import { produce } from "immer";
import { Checkbox } from "@/components";
import {
  NoFundsActionItems,
  SupportedAssets,
  CreateRebalancerCopy,
  useBaseTokenValue,
  useLivePortfolio,
  useMinimumRequiredValue,
  useNoSupportedAssetsWarning,
} from "@/app/rebalancer/ui";
import {
  InputLabel,
  LoadingSkeleton,
  CalloutBox,
  TableCell,
  Heading,
} from "@valence-ui/ui-components";

export const EditAssetsForAccount: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
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
    useNoSupportedAssetsWarning(address);

  if (isLoadingBalances)
    return (
      <DepositAssetsLayout
        baseDenom={baseTokenDenom}
        subContent={<LoadingSkeleton className="min-h-56" />}
      ></DepositAssetsLayout>
    );

  if (isBalancesFetched && (!isHoldingMinimumFee || !isHoldingAtLeastOneAsset))
    return (
      <DepositAssetsLayout
        baseDenom={baseTokenDenom}
        subContent={
          <>
            {!isHoldingAtLeastOneAsset && (
              <CalloutBox
                variant="warn"
                title="Rebalancer account does not hold any assets supported by the Rebalancer."
              >
                <p>
                  Deposit funds into the Rebalancer account to continue{" "}
                  <span className="font-mono text-sm ">({address})</span>.
                </p>
                <NoFundsActionItems />
              </CalloutBox>
            )}
          </>
        }
      ></DepositAssetsLayout>
    );

  return (
    <DepositAssetsLayout baseDenom={baseTokenDenom}>
      <div className="flex max-w-[90%] flex-row gap-20">
        <div
          role="grid"
          className="grid grid-cols-[2fr_1fr_1fr] justify-items-start gap-x-8 gap-y-1"
        >
          <InputLabel size="sm" noGap label="Funds in rebalancer account" />
          <InputLabel size="sm" noGap label="Value (USD)" />
          <InputLabel size="sm" noGap label="Added to Rebalancer" />

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
                  <TableCell
                    align="left"
                    variant="input"
                    className="flex gap-2"
                  >
                    <span>{displayNumber(amount, { precision: 2 })}</span>
                    <span>{lineItem.symbol}</span>
                  </TableCell>

                  <TableCell align="left" variant="input">
                    {valueDisplayString}
                  </TableCell>
                  <TableCell align="left" variant="input">
                    <Checkbox
                      checked={!!target}
                      onChange={(value) => {
                        if (!!value) {
                          addTarget(lineItem.denom);
                        } else removeTarget(lineItem.denom);
                      }}
                    />
                  </TableCell>
                </Fragment>
              );
            })}
        </div>
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
        <Heading level="h6">
          {" "}
          {CreateRebalancerCopy.step_edit_SelectAssets.title}
        </Heading>

        <p className="w-3/4 text-sm">
          {CreateRebalancerCopy.step_edit_SelectAssets.subTitle}
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
