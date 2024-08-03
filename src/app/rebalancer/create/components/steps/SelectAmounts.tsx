import { Button, Dropdown, DropdownOption } from "@/components";
import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { Fragment, useCallback, useEffect, useState } from "react";
import { BsDash } from "react-icons/bs";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { UseFormReturn } from "react-hook-form";
import { produce } from "immer";
import { useSupportedBalances } from "@/hooks";
import { displayNumber, displayValue } from "@/utils";
import { PlaceholderRows } from "@/app/rebalancer/create/components";
import { useAssetCache, useBaseTokenValue } from "@/app/rebalancer/hooks";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export const SetStartingAmounts: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const { register, setValue, watch } = form;

  const assetInputs = watch("assets");
  const { data: balances } = useSupportedBalances(address);

  const { getAsset } = useAssetCache();

  const removeAsset = useCallback(
    (denomToRemove: string) => {
      return produce(assetInputs, (draft) => {
        const index = draft.findIndex((asset) => asset.denom === denomToRemove);
        if (index !== -1) draft.splice(index, 1);
      });
    },
    [assetInputs],
  );

  const baseDenomOptions: DropdownOption<string>[] = [];
  balances?.forEach((balance) => {
    const asset = getAsset(balance.denom);
    if (asset) {
      baseDenomOptions.push({
        label: asset.symbol,
        value: balance.denom,
      });
    }
  });

  const baseTokenDenom = watch("baseTokenDenom");

  const {
    isLoading: isValueLoading,
    calculateValue,
    baseTokenAsset,
  } = useBaseTokenValue({
    baseTokenDenom,
  });

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_StartingAmounts.title}
        </h1>
        <div className="flex flex-col gap-2">
          <p className="w-3/4 text-sm ">
            {CreateRebalancerCopy.step_StartingAmounts.subTitle}
          </p>
          <p className="w-3/4 text-sm ">
            {CreateRebalancerCopy.step_StartingAmounts.info1}
          </p>
        </div>
      </div>
      <div>
        <div className="w-full pb-2 font-semibold">Initial Amounts</div>
        <div
          role="grid"
          className="grid w-1/2 grid-cols-[200px_160px_auto] justify-items-start  gap-x-4 gap-y-2"
        >
          {assetInputs
            .sort((a, b) => a.symbol.localeCompare(b.symbol))
            .map((field, index: number) => {
              const value = calculateValue({
                denom: field.denom,
                amount: field.startingAmount,
              });
              const valueDisplayString = displayValue({
                value: displayNumber(value, { precision: 2 }),
                symbol: baseTokenAsset?.symbol ?? "USDC",
              });

              return (
                <Fragment key={`asset-select-row-${index}`}>
                  <div
                    role="gridcell"
                    className="relative flex items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue "
                  >
                    <input
                      placeholder="0.00"
                      className="h-full w-full max-w-[60%]  bg-transparent p-2 font-mono focus:outline-none  "
                      type="number"
                      autoFocus={index === 0}
                      {...register(`assets.${index}.startingAmount`)}
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono">
                      {field.symbol}
                    </span>
                  </div>

                  {isValueLoading ? (
                    <div role="gridcell" className="w-full">
                      <LoadingSkeleton className="max-h-11 min-h-11 w-full" />
                    </div>
                  ) : (
                    <div
                      role="gridcell"
                      className="flex items-center  p-1 font-mono font-light"
                    >
                      ({valueDisplayString})
                    </div>
                  )}

                  <div>
                    <Button
                      variant="secondary"
                      className="flex w-fit items-center justify-center gap-2 text-nowrap py-1  "
                      onClick={() => {
                        setValue("assets", removeAsset(field.denom));
                      }}
                    >
                      <BsDash className="h-6 w-6" />
                      <span>Remove</span>
                    </Button>
                  </div>
                </Fragment>
              );
            })}
          <PlaceholderRows length={assetInputs.length} />
        </div>
      </div>

      <div className="max-w-[200px]">
        <div className="w-full pb-1 font-semibold">Value assets in</div>
        <Dropdown
          selected={watch(`baseTokenDenom`)}
          onSelected={(value) => setValue(`baseTokenDenom`, value)}
          options={baseDenomOptions ?? []}
        />
      </div>
    </section>
  );
};
