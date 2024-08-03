import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { Fragment, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { cn, displayNumber } from "@/utils";
import { PlaceholderRows, WarnText } from "@/app/rebalancer/create/components";
import { useBaseTokenValue } from "@/app/rebalancer/hooks";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export const SelectRebalancerTargets: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const { setValue, watch } = form;

  const targets = watch("targets");
  const assets = watch("assets");
  const baseTokenDenom = watch("baseTokenDenom");
  const { isLoading: isValueLoading, calculateValue } = useBaseTokenValue({
    baseTokenDenom,
  });

  const totalValue = assets.reduce((acc, asset) => {
    const value = calculateValue({
      amount: Number(asset.startingAmount),
      denom: asset.denom,
    });
    return acc + value;
  }, 0);

  const isMimumumValueSet = targets?.some((t) => t.minimumAmount);

  return (
    <section className="flex w-full flex-col gap-8">
      <div className="col-span-4 flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_SelectTargets.title}
        </h1>
        <p className="w-3/4 text-sm">
          {CreateRebalancerCopy.step_SelectTargets.subTitle}
        </p>
      </div>

      <div className="w-full">
        <div className="pb-2 font-semibold">Asset distribution</div>
        {isValueLoading ? (
          <LoadingSkeleton className="min-h-36" />
        ) : (
          <div className="grid grid-cols-[200px_200px_200px] gap-x-4 gap-y-2">
            <div
              role="columnheader"
              className="font-base font-base   flex items-end  text-xs"
            >
              Initial distribution
            </div>

            <div
              role="columnheader"
              className="font-base font-base  flex items-end  text-xs"
            >
              Target distribution
            </div>
            <div
              role="columnheader"
              className="font-base font-base  flex items-end  text-xs"
            >
              Minimum balance (optional)
            </div>

            {assets.map((field, index: number) => {
              const distribution =
                totalValue === 0
                  ? 0
                  : calculateValue({
                      amount: Number(field.startingAmount),
                      denom: field.denom,
                    }) / totalValue;

              const hasMimumValueProperty = targets[index]?.minimumAmount;

              const disableMinimumValue =
                isMimumumValueSet && !hasMimumValueProperty;

              return (
                <Fragment key={`target-select-row-${index}`}>
                  <div
                    key={`target-select-row-${index}`}
                    role="gridcell"
                    className="relative flex min-h-11 items-center font-mono font-light"
                  >
                    {displayNumber(distribution * 100, {
                      precision: 2,
                    })}
                    % {field.symbol}
                  </div>

                  <div
                    role="gridcell"
                    className="relative flex items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue "
                  >
                    <input
                      className="h-full w-full max-w-[50%] bg-transparent  p-1 font-mono focus:outline-none"
                      type="number"
                      placeholder="10.00"
                      value={watch(`targets.${index}.bps`)}
                      onChange={(e) => {
                        setValue(`targets.${index}`, {
                          ...targets[index],
                          bps: parseFloat(e.target.value),
                          denom: field.denom,
                        });
                      }}
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono font-mono">
                      % {field.symbol}
                    </span>
                  </div>

                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div
                        role="gridcell"
                        className={cn(
                          disableMinimumValue
                            ? "cursor-not-allowed border-valence-mediumgray bg-valence-mediumgray font-mono"
                            : "border-valence-lightgray bg-valence-lightgray",
                          "relative flex items-center border-[1.5px]  focus-within:border-valence-blue",
                        )}
                      >
                        <input
                          disabled={disableMinimumValue}
                          className={cn(
                            disableMinimumValue &&
                              "cursor-not-allowed bg-valence-gray",
                            "h-full w-full max-w-[50%]  bg-transparent p-1 focus:outline-none",
                          )}
                          type="number"
                          placeholder="10.000"
                          value={watch(`targets.${index}.minimumAmount`)}
                          onChange={(e) => {
                            setValue(`targets.${index}`, {
                              ...targets[index],
                              minimumAmount: parseFloat(e.target.value),
                            });
                          }}
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono">
                          {field.symbol}
                        </span>
                      </div>
                    </TooltipTrigger>
                    {disableMinimumValue && (
                      <TooltipContent className="max-w-64 text-balance text-center">
                        {
                          "Minimum balance can be set for one asset per account."
                        }
                      </TooltipContent>
                    )}
                  </Tooltip>
                </Fragment>
              );
            })}
            <PlaceholderRows length={assets.length} />
            {targets.length > 0 &&
              targets.every((t) => Number(t.bps) > 0) &&
              targets.reduce((acc, target) => acc + target.bps, 0) !== 100 && (
                <WarnText
                  text="Total distribution must equal 100%"
                  className="text-warn"
                />
              )}
          </div>
        )}
      </div>
    </section>
  );
};
