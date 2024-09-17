import {
  CreateRebalancerCopy,
  RebalancerFormTooltipCopy,
} from "@/app/rebalancer/create/copy";
import { Fragment, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { cn, displayNumber } from "@/utils";
import { useAssetCache, useBaseTokenValue } from "@/app/rebalancer/hooks";
import { Asset } from "@/app/rebalancer/components";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Dropdown,
  IconButton,
  LoadingSkeleton,
  QuestionTooltipContent,
  WithQuestionTooltip,
} from "@/components";
import { InputTableCell, WarnTextV2 } from "@/app/rebalancer/create/components";
import { BsPlus, BsX } from "react-icons/bs";
import { produce } from "immer";
import { useWhitelistedDenoms } from "@/hooks";

export const SetTargets: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
  isCleanStartingAmountEnabled?: boolean; // bandaid fix for supporting edit
}> = ({ form, isCleanStartingAmountEnabled = true }) => {
  const { setValue, watch, getValues } = form;

  const targets = watch("targets");
  const initialAssets = watch("initialAssets");
  const baseTokenDenom = watch("baseTokenDenom");
  const { isLoading: isValueLoading, calculateValue } = useBaseTokenValue({
    baseTokenDenom,
  });
  const { getOriginAsset } = useAssetCache();
  const { data: whitelist } = useWhitelistedDenoms();

  // this is needed to display everything correctly in dropdown
  const allDenomDropdownOptions = !!whitelist?.denom_whitelist?.length
    ? whitelist?.denom_whitelist.map((denom) => {
        const asset = getOriginAsset(denom);
        return {
          value: denom,
          label: asset?.symbol ?? "",
          display: <Asset symbol={asset?.symbol} />,
        };
      })
    : [];

  // give a filtered subset based on what is already selected
  const availableDropdownOptions = allDenomDropdownOptions.filter(
    (option) => !targets.find((t) => t.denom === option.value),
  );

  const totalValue = initialAssets.reduce((acc, asset) => {
    const _value = calculateValue({
      amount: Number(asset.startingAmount),
      denom: asset.denom,
    });
    const value = isNaN(_value) ? 0 : _value;
    return acc + value;
  }, 0);

  const isMimumumValueSet = targets?.some((t) => t.minimumAmount);

  const removeTarget = useCallback(
    (index: number) => {
      const targets = getValues("targets");

      setValue(
        "targets",
        produce(targets, (draft: CreateRebalancerForm["targets"]) => {
          draft.splice(index, 1);
        }),
      );
    },
    [setValue, getValues],
  );

  const addEmptyAsset = useCallback(() => {
    const targets = getValues("targets");

    setValue(
      "targets",
      produce(targets, (draft: CreateRebalancerForm["targets"]) => {
        draft.push({
          bps: 0,
          denom: undefined,
        });
      }),
    );
  }, [setValue, getValues]);

  const clearStartingAmont = useCallback(
    (denom: string) => {
      if (!isCleanStartingAmountEnabled) return;
      const initialAssets = getValues("initialAssets");
      const index = initialAssets.findIndex((a) => a.denom === denom);
      if (index == -1) return; // should not happen
      const updatedArray = produce(
        initialAssets,
        (draft: CreateRebalancerForm["initialAssets"]) => {
          draft[index] = { ...draft[index], startingAmount: 0 };
        },
      );
      setValue("initialAssets", updatedArray);
    },
    [isCleanStartingAmountEnabled, setValue, getValues],
  );

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_SelectTargets.title}
        </h1>
        <p className="w-3/4 text-sm">
          {CreateRebalancerCopy.step_SelectTargets.subTitle}
        </p>
      </div>
      <div className="flex w-full max-w-[90%] flex-row gap-20">
        {isValueLoading ? (
          <LoadingSkeleton className="min-h-36" />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="grid h-fit grid-cols-[1fr_1fr_2fr_2fr_auto] gap-x-8 gap-y-2">
              <InputTableCell className="justify-start" variant="header">
                Asset
              </InputTableCell>
              <InputTableCell className="justify-start" variant="header">
                Current Distribution
              </InputTableCell>
              <InputTableCell className="justify-start" variant="header">
                Target Distribution
              </InputTableCell>
              <InputTableCell className="justify-start" variant="header">
                <WithQuestionTooltip
                  tooltipContent={
                    <QuestionTooltipContent
                      {...RebalancerFormTooltipCopy.minBalance}
                    />
                  }
                >
                  {RebalancerFormTooltipCopy.minBalance.title}
                </WithQuestionTooltip>
              </InputTableCell>
              <InputTableCell
                className="h-full flex-col items-center justify-center"
                variant="header"
              ></InputTableCell>

              {targets?.map((field, index: number) => {
                const initialAsset = getValues("initialAssets")
                  .filter((a) => !!a)
                  .find((a) => field.denom === a.denom);

                const assetMetadata = getOriginAsset(field.denom ?? "");

                const hasMimumValueProperty = targets[index]?.minimumAmount;

                const disableMinimumValue =
                  isMimumumValueSet && !hasMimumValueProperty;

                const distribution =
                  totalValue === 0
                    ? 0
                    : calculateValue({
                        amount: Number(initialAsset?.startingAmount),
                        denom: field.denom ?? "0",
                      }) / totalValue;

                return (
                  <Fragment key={`target-select-row-${index}`}>
                    <InputTableCell className="relative flex items-center justify-start   ">
                      <Dropdown
                        selectedDisplay={
                          <Asset symbol={assetMetadata?.symbol} />
                        }
                        containerClassName="min-w-32"
                        availableOptions={availableDropdownOptions} // to give field access to the values of what is selected
                        options={allDenomDropdownOptions} // only allow user to select what is not already selected
                        onSelected={(value) => {
                          const current = getValues(`targets.${index}`);
                          if (current?.denom)
                            clearStartingAmont(current?.denom);
                          setValue(`targets.${index}`, {
                            ...current,
                            denom: value,
                          });
                        }}
                        selected={watch(`targets.${index}.denom`)}
                      />
                    </InputTableCell>
                    <InputTableCell variant="number">
                      {displayNumber(distribution * 100, {
                        precision: 2,
                      })}
                      %
                    </InputTableCell>
                    <InputTableCell className="relative flex items-center justify-start border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue">
                      <input
                        // @ts-ignore
                        onWheel={(e) => e.target?.blur()} // prevent scroll
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
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono">
                        %
                      </span>
                    </InputTableCell>

                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <InputTableCell
                          className={cn(
                            disableMinimumValue
                              ? "cursor-not-allowed border-valence-mediumgray bg-valence-mediumgray font-mono"
                              : "border-valence-lightgray bg-valence-lightgray",
                            "relative flex items-center border-[1.5px]  focus-within:border-valence-blue",
                          )}
                        >
                          <input
                            // @ts-ignore
                            onWheel={(e) => e.target?.blur()} // prevent scroll
                            disabled={disableMinimumValue}
                            className={cn(
                              "justify-start",
                              disableMinimumValue &&
                                "cursor-not-allowed bg-valence-gray",
                              "h-full w-full max-w-[50%]  bg-transparent p-1 focus:outline-none",
                            )}
                            type="number"
                            value={watch(`targets.${index}.minimumAmount`)}
                            onChange={(e) => {
                              setValue(`targets.${index}`, {
                                ...targets[index],
                                minimumAmount: parseFloat(e.target.value),
                              });
                            }}
                          />
                          <span
                            className={cn(
                              "pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 transform font-mono text-valence-gray",
                              hasMimumValueProperty && "text-valence-black",
                            )}
                          >
                            {assetMetadata?.symbol}
                          </span>
                        </InputTableCell>
                      </TooltipTrigger>
                      {disableMinimumValue && (
                        <TooltipContent className="max-w-64 text-balance text-center">
                          {
                            "Minimum balance can be set for one asset per account."
                          }
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <InputTableCell
                      className="h-full flex-col items-center justify-center"
                      variant="header"
                    >
                      <IconButton
                        onClick={() => {
                          removeTarget(index);

                          if (initialAsset?.startingAmount) {
                            clearStartingAmont(initialAsset?.denom);
                          }
                        }}
                        Icon={BsX}
                      />
                    </InputTableCell>
                  </Fragment>
                );
              })}

              <InputTableCell className="" variant="header">
                <IconButton onClick={addEmptyAsset} Icon={BsPlus} />
              </InputTableCell>
            </div>
            <div className="flex flex-col gap-2">
              {initialAssets?.every(
                (a) => !a.startingAmount || a.startingAmount === 0,
              ) && (
                <WarnTextV2
                  text=" Select at least one starting amount in Step 1 to continue.
                  "
                  variant="info"
                />
              )}

              {targets?.length < 2 && (
                <WarnTextV2
                  text="Select at least two targets.
                  "
                  variant="info"
                />
              )}
              {targets?.length > 0 &&
                targets.some((t) => Number(t.bps) > 0) &&
                targets.reduce((acc, target) => acc + target.bps, 0) !==
                  100 && (
                  <WarnTextV2
                    text=" Total distribution must equal 100%"
                    variant="warn"
                  />
                )}

              {targets?.length > 0 &&
                targets.some(
                  (t) => Number(t.bps) === 0 || Number(t.bps) === 100,
                ) && (
                  <WarnTextV2
                    text="Percentages must be between .01% and 99.99%."
                    variant="warn"
                  />
                )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
