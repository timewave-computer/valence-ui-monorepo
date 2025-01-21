"use client";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import {
  Dropdown,
  DropdownOption,
  RadioGroup,
  RadioGroupItem,
} from "@/components";
import {
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  FormField,
  InputLabel,
  FormControl,
  Asset,
  TextInput,
  LinkText,
  Heading,
} from "@valence-ui/ui-components";
import { TargetOverrideStrategy } from "@/types/rebalancer";
import { useMemo, useState } from "react";

import {
  RebalancerFormTooltipCopy,
  SymbolColors,
  useAssetMetadata,
  useWhitelistedDenoms,
} from "@/app/rebalancer/ui";

export const AdvancedSettings: React.FC<{
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
  address: string;
}> = ({ form, address }) => {
  const { watch, setValue, register } = form;

  const strategy = watch("targetOverrideStrategy");
  const { data: whitelistedDenoms } = useWhitelistedDenoms();
  const { getOriginAsset } = useAssetMetadata();

  const baseDenomDropdownOptions: DropdownOption<string>[] = useMemo(() => {
    if (!whitelistedDenoms?.base_denom_whitelist) return [];
    return whitelistedDenoms?.base_denom_whitelist.map((a) => {
      const asset = getOriginAsset(a.denom);
      return {
        value: a.denom,
        label: asset?.symbol ?? "",
        display: (
          <Asset
            color={SymbolColors.get(asset?.symbol ?? "")}
            symbol={asset?.symbol}
          />
        ),
      };
    });
  }, [whitelistedDenoms?.base_denom_whitelist, getOriginAsset]);
  const selectedBaseDenom = watch("baseTokenDenom");
  const selectedBaseDenomAsset = getOriginAsset(selectedBaseDenom);

  const [allowOtherAddressInput, setAllowOtherAddressInput] = useState(false);

  return (
    <CollapsibleSectionRoot variant="secondary" defaultIsOpen={false}>
      <CollapsibleSectionHeader>
        <Heading level="h3">Advanced settings</Heading>
      </CollapsibleSectionHeader>
      <CollapsibleSectionContent>
        <div className="flex flex-col gap-6">
          <p className="text-sm">
            Advanced settings are pre-filled with recommended defaults, but can
            support more advanced requirements if needed.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <InputLabel
                  size="sm"
                  label={RebalancerFormTooltipCopy.baseDenom.title}
                  tooltipContent={RebalancerFormTooltipCopy.baseDenom.text}
                />
                <Dropdown
                  className="max-w-[30%]"
                  selected={watch(`baseTokenDenom`)}
                  onSelected={(value) => setValue(`baseTokenDenom`, value)}
                  options={baseDenomDropdownOptions ?? []}
                  selectedDisplay={
                    <Asset
                      color={SymbolColors.get(
                        selectedBaseDenomAsset?.symbol ?? "",
                      )}
                      symbol={selectedBaseDenomAsset?.symbol}
                    />
                  }
                />
              </div>
              <div className="flex flex-col">
                <InputLabel
                  size="sm"
                  label={RebalancerFormTooltipCopy.strategy.title}
                  tooltipContent={RebalancerFormTooltipCopy.strategy.text}
                  tooltipChildren={
                    <>
                      See{" "}
                      <LinkText
                        variant="highlighted"
                        href="https://github.com/timewave-computer/valence-services/tree/main/contracts/services/rebalancer#target-override-strategy"
                        blankTarget={true}
                      >
                        {" "}
                        here
                      </LinkText>{" "}
                      for an explanation with examples.
                    </>
                  }
                />

                <Dropdown
                  className="max-w-[30%]"
                  selected={strategy}
                  onSelected={(value) => {
                    setValue("targetOverrideStrategy", value);
                  }}
                  options={TargetOverrideStartegyOptions}
                />
              </div>
              <div className="flex flex-col ">
                <InputLabel
                  size="sm"
                  label={RebalancerFormTooltipCopy.maxLimit.title}
                  tooltipContent={RebalancerFormTooltipCopy.maxLimit.text}
                />
                <FormField name="maxLimit">
                  <FormControl asChild>
                    <TextInput
                      type="number"
                      suffix="%"
                      className="max-w-[30%]"
                      placeholder="0.00"
                      {...register(`maxLimit`)}
                    />
                  </FormControl>
                </FormField>
              </div>
              <div className="flex flex-col ">
                <InputLabel
                  size="sm"
                  tooltipContent={RebalancerFormTooltipCopy.trustee.text}
                  label={RebalancerFormTooltipCopy.trustee.title}
                />
                <RadioGroup
                  onValueChange={() => {
                    setAllowOtherAddressInput(!allowOtherAddressInput);
                  }}
                  defaultValue={TrusteeOptions.OnlyThisWallet}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      onClick={() => setValue("trustee", undefined)}
                      value={TrusteeOptions.OnlyThisWallet}
                      id={TrusteeOptions.OnlyThisWallet}
                    />
                    <p className="text-sm">
                      Only my wallet{" "}
                      <span className="font-mono text-xs">({address})</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value={TrusteeOptions.ThisWalletAndAnotherAddress}
                      id={TrusteeOptions.ThisWalletAndAnotherAddress}
                    />
                    <p className="text-sm">My wallet and another address</p>
                  </div>
                </RadioGroup>
                {allowOtherAddressInput && (
                  <TextInput
                    isDisabled={!allowOtherAddressInput}
                    type="text"
                    className="max-w-[75%] mt-2"
                    placeholder="neutron1234..."
                    {...register("trustee")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSectionContent>
    </CollapsibleSectionRoot>
  );
};

const TargetOverrideStartegyOptions: Array<{
  label: string;
  value: TargetOverrideStrategy;
}> = [
  {
    label: "Proportional",
    value: "proportional",
  },
  {
    label: "Priority",
    value: "priority",
  },
];

enum TrusteeOptions {
  OnlyThisWallet = "OnlyThisWallet",
  ThisWalletAndAnotherAddress = "ThisWalletAndAnotherAddress",
}
