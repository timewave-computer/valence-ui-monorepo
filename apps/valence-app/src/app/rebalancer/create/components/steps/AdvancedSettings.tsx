"use client";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import {
  Dropdown,
  DropdownOption,
  LinkText,
  RadioGroup,
  RadioGroupItem,
} from "@/components";
import {
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  FormTextInput,
  FormField,
  FormInputLabel,
} from "@valence-ui/ui-components";
import { TargetOverrideStrategy } from "@/types/rebalancer";
import { useMemo, useState } from "react";
import { useWhitelistedDenoms } from "@/hooks";
import { useAssetMetadata } from "@/app/rebalancer/ui";
import { cn } from "@/utils";
import { RebalancerFormTooltipCopy } from "../../copy";
import { Asset } from "@/app/rebalancer/ui";

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
        display: <Asset symbol={asset?.symbol} />,
      };
    });
  }, [whitelistedDenoms?.base_denom_whitelist, getOriginAsset]);
  const selectedBaseDenom = watch("baseTokenDenom");
  const selectedBaseDenomAsset = getOriginAsset(selectedBaseDenom);

  const [allowOtherAddressInput, setAllowOtherAddressInput] = useState(false);

  return (
    <CollapsibleSectionRoot defaultIsOpen={false}>
      <CollapsibleSectionHeader>
        <span className="text-lg font-bold">Advanced settings</span>
      </CollapsibleSectionHeader>
      <CollapsibleSectionContent>
        <div className="flex flex-col gap-6">
          <p className="text-sm">
            Advanced settings are pre-filled with recommended defaults, but can
            support more advanced requirements if needed.
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <FormInputLabel
                  label={RebalancerFormTooltipCopy.baseDenom.title}
                  tooltipContent={RebalancerFormTooltipCopy.baseDenom.text}
                />
                <Dropdown
                  className="max-w-[30%]"
                  selected={watch(`baseTokenDenom`)}
                  onSelected={(value) => setValue(`baseTokenDenom`, value)}
                  options={baseDenomDropdownOptions ?? []}
                  selectedDisplay={
                    <Asset symbol={selectedBaseDenomAsset?.symbol} />
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-fit pb-1 text-xs font-normal">
                  <FormInputLabel
                    label={RebalancerFormTooltipCopy.strategy.title}
                    tooltipContent={RebalancerFormTooltipCopy.strategy.text}
                    tooltipChildren={
                      <>
                        See{" "}
                        <LinkText
                          className=" border-valence-blue text-valence-blue hover:border-b"
                          href="https://github.com/timewave-computer/valence-services/tree/main/contracts/services/rebalancer#target-override-strategy"
                          openInNewTab={true}
                        >
                          {" "}
                          here
                        </LinkText>{" "}
                        for an explanation with examples.
                      </>
                    }
                  />
                </div>

                <Dropdown
                  className="max-w-[30%]"
                  selected={strategy}
                  onSelected={(value) => {
                    setValue("targetOverrideStrategy", value);
                  }}
                  options={TargetOverrideStartegyOptions}
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <FormInputLabel
                  label={RebalancerFormTooltipCopy.maxLimit.title}
                  tooltipContent={RebalancerFormTooltipCopy.maxLimit.text}
                />
                <FormField name="maxLimit">
                  <FormTextInput
                    containerClassName="max-w-[30%]"
                    type="number"
                    suffix="%"
                    placeholder="0.00"
                    {...register(`maxLimit`)}
                  />
                </FormField>
              </div>
              <div className="flex flex-col gap-2 ">
                <FormInputLabel
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
                      <span className="font-mono text-sm font-light">
                        ({address})
                      </span>
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
                  <div
                    className={cn(
                      "mt-2 w-3/4",

                      "border-valence-lightgray bg-valence-lightgray",
                      " flex items-center border-[1.5px]  focus-within:border-valence-blue",
                    )}
                  >
                    <input
                      className={cn(
                        " font-mono",
                        !allowOtherAddressInput &&
                          "cursor-not-allowed bg-valence-gray",
                        "h-full w-full bg-transparent p-2 transition-all focus:outline-none",
                      )}
                      type="text"
                      placeholder="neutron1234..."
                      {...register("trustee")}
                    />
                  </div>
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
