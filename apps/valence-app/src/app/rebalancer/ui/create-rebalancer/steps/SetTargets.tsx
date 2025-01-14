import { Fragment, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { displayNumber } from "@/utils";
import {
  useAssetMetadata,
  useBaseTokenValue,
  CreateRebalancerCopy,
  RebalancerFormTooltipCopy,
  useWhitelistedDenoms,
  SymbolColors,
} from "@/app/rebalancer/ui";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import { Dropdown } from "@/components";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  IconButton,
  FormField,
  InputLabel,
  LoadingSkeleton,
  Asset,
  FormControl,
  TextInput,
  InfoText,
  TableCell,
} from "@valence-ui/ui-components";
import { BsPlus, BsX } from "react-icons/bs";
import { produce } from "immer";
import { useIsServer } from "@/hooks";

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
  const { getOriginAsset } = useAssetMetadata();
  const { data: whitelist } = useWhitelistedDenoms();

  // this is needed to display everything correctly in dropdown
  const allDenomDropdownOptions = !!whitelist?.denom_whitelist?.length
    ? whitelist?.denom_whitelist.map((denom) => {
        const asset = getOriginAsset(denom);
        return {
          value: denom,
          label: asset?.symbol ?? "",
          display: (
            <Asset
              size="sm"
              color={SymbolColors.get(asset?.symbol ?? "")}
              symbol={asset?.symbol}
            />
          ),
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

  const isServer = useIsServer();

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
            <div className="grid h-fit grid-cols-[1fr_1fr_2fr_2fr_auto] gap-x-8 gap-y-1">
              <InputLabel size="sm" noGap label="Asset" />

              <InputLabel size="sm" noGap label="Current Distribution" />

              <InputLabel size="sm" noGap label="Target Distribution" />

              <InputLabel
                size="sm"
                noGap
                tooltipContent={RebalancerFormTooltipCopy.minBalance.text}
                label={RebalancerFormTooltipCopy.minBalance.title}
              />

              <InputLabel size="sm" noGap label="" />

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

                const target = watch(`targets.${index}.bps`);

                return (
                  <Fragment key={`target-select-row-${index}`}>
                    <TableCell variant="input" align="left">
                      <Dropdown
                        selectedDisplay={
                          <Asset
                            size="sm"
                            color={SymbolColors.get(
                              assetMetadata?.symbol ?? "",
                            )}
                            symbol={assetMetadata?.symbol}
                          />
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
                    </TableCell>
                    <TableCell variant="input" align="left">
                      {displayNumber(distribution * 100, {
                        precision: 2,
                      })}
                      %
                    </TableCell>
                    <TableCell variant="input" align="left">
                      <FormField
                        className="w-full"
                        name={`targets.${index}.bps`}
                      >
                        <FormControl asChild>
                          <TextInput
                            size="sm"
                            name={`targets.${index}.bps`}
                            suffix="%"
                            type="number"
                            placeholder="10.00"
                            className="w-full"
                            isError={
                              target !== 0 &&
                              !isNaN(target) &&
                              !isValidPercentage(target)
                            }
                            value={target}
                            onChange={(e) => {
                              setValue(`targets.${index}`, {
                                ...targets[index],
                                bps: parseFloat(e.target.value),
                                denom: field.denom,
                              });
                            }}
                          />
                        </FormControl>
                      </FormField>
                    </TableCell>

                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <TableCell variant="input" align="left">
                          <FormField name={`targets.${index}.minimumAmount`}>
                            <FormControl asChild>
                              <TextInput
                                name={`targets.${index}.minimumAmount`}
                                size="sm"
                                isDisabled={disableMinimumValue}
                                type="number"
                                value={watch(`targets.${index}.minimumAmount`)}
                                onChange={(e) => {
                                  setValue(`targets.${index}`, {
                                    ...targets[index],
                                    minimumAmount: parseFloat(e.target.value),
                                  });
                                }}
                                suffix={assetMetadata?.symbol}
                              />
                            </FormControl>
                          </FormField>
                        </TableCell>
                      </TooltipTrigger>
                      {disableMinimumValue && (
                        <TooltipContent className="max-w-64 text-balance text-center">
                          {
                            "Minimum balance can be set for one asset per account."
                          }
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <TableCell
                      variant="input"
                      align="center"
                      className="h-full flex-col items-center justify-center"
                    >
                      <IconButton
                        isServer={isServer}
                        onClick={() => {
                          removeTarget(index);

                          if (initialAsset?.startingAmount) {
                            clearStartingAmont(initialAsset?.denom);
                          }
                        }}
                        Icon={BsX}
                      />
                    </TableCell>
                  </Fragment>
                );
              })}

              <TableCell align="left" variant="input">
                <IconButton
                  isServer={isServer}
                  onClick={addEmptyAsset}
                  Icon={BsPlus}
                />
              </TableCell>
            </div>
            <div className="flex flex-col gap-2">
              {initialAssets?.every(
                (a) => !a.startingAmount || a.startingAmount === 0,
              ) && (
                <InfoText variant="info">
                  Select at least one starting amount in Step 1 to continue
                </InfoText>
              )}

              {targets?.length < 2 && (
                <InfoText variant="info">Select at least two targets</InfoText>
              )}
              {targets?.length > 0 &&
                targets.some((t) => Number(t.bps) > 0) &&
                targets.reduce((acc, target) => acc + target.bps, 0) !==
                  100 && (
                  <InfoText variant="warn">
                    Total distribution must equal 100%
                  </InfoText>
                )}

              {targets?.length > 0 &&
                targets.some((t) => !isValidPercentage(Number(t.bps))) && (
                  <InfoText variant="warn">
                    Percentages must be between .01% and 99.99%
                  </InfoText>
                )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const isValidPercentage = (value: number) => value > 0 && value < 100;
