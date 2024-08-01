import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { Fragment, useCallback } from "react";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { UseFormReturn } from "react-hook-form";
import { useSupportedBalances } from "@/hooks";
import { displayNumber } from "@/utils";
import { PlaceholderRows, WarnText } from "@/app/rebalancer/create/components";
import { useBaseTokenValue } from "@/app/rebalancer/hooks/use-value-distribution";

export const SelectRebalancerTargets: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const { setValue, watch } = form;

  const targets = watch("targets");
  const assets = watch("assets");
  const baseTokenDenom = watch("baseTokenDenom");

  const { data: balances } = useSupportedBalances(address);

  const { isLoading: isValueLoading, calculateValue } = useBaseTokenValue({
    balances,
    baseTokenDenom,
  });

  const totalValue = assets?.reduce((acc, b) => {
    const value = calculateValue(Number(b.startingAmount), b.denom);
    return acc + value;
  }, 0);

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
          <div className=" min-h-36 animate-pulse bg-valence-lightgray"></div>
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
                  : calculateValue(Number(field.startingAmount), field.denom) /
                    totalValue;

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
                      className="h-full w-full max-w-[50%]  bg-transparent p-1 focus:outline-none"
                      type="number"
                      placeholder="10.00"
                      value={watch(`targets.${index}.bps`)}
                      onChange={(e) => {
                        setValue(`targets.${index}`, {
                          ...targets[index],
                          bps: parseFloat(e.target.value),
                        });
                      }}
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono">
                      % {field.symbol}
                    </span>
                  </div>
                  <div
                    role="gridcell"
                    className="relative flex items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue "
                  >
                    <input
                      className="h-full w-full max-w-[50%]  bg-transparent p-1 focus:outline-none"
                      type="number"
                      placeholder="10.000"
                    />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono">
                      {field.symbol}
                    </span>
                  </div>
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
