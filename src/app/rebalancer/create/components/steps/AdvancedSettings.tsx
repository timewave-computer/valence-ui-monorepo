"use client";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import {
  Dropdown,
  DropdownOption,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  LinkText,
  QuestionTooltipContent,
  RadioGroup,
  RadioGroupItem,
  WithQuestionTooltip,
} from "@/components";
import { TargetOverrideStrategy } from "@/types/rebalancer";
import { useMemo, useState } from "react";
import { useWhitelistedDenoms } from "@/hooks";
import { useAssetCache } from "@/app/rebalancer/hooks";
import { cn } from "@/utils";
import { RebalancerFormTooltipCopy } from "../../copy";
import { Asset } from "@/app/rebalancer/components";

export const AdvancedSettings: React.FC<{
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
  address: string;
}> = ({ form, address }) => {
  const { watch, setValue, register } = form;

  const strategy = watch("targetOverrideStrategy");
  const { data: whitelistedDenoms } = useWhitelistedDenoms();
  const { getOriginAsset } = useAssetCache();

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
                <WithQuestionTooltip
                  tooltipContent={
                    <QuestionTooltipContent
                      {...RebalancerFormTooltipCopy.baseDenom}
                    />
                  }
                >
                  <div className="col-span-2 h-fit pb-1 text-xs font-medium ">
                    {RebalancerFormTooltipCopy.baseDenom.title}
                  </div>
                </WithQuestionTooltip>

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
                  <WithQuestionTooltip
                    tooltipContent={
                      <QuestionTooltipContent
                        {...RebalancerFormTooltipCopy.strategy}
                      >
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
                      </QuestionTooltipContent>
                    }
                  >
                    {RebalancerFormTooltipCopy.strategy.title}
                  </WithQuestionTooltip>
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
                <div className="h-fit pb-1 text-xs font-medium">
                  <WithQuestionTooltip
                    tooltipContent={
                      <QuestionTooltipContent
                        {...RebalancerFormTooltipCopy.maxLimit}
                      />
                    }
                  >
                    {RebalancerFormTooltipCopy.maxLimit.title}
                  </WithQuestionTooltip>
                </div>

                <div className="relative flex max-w-[30%] items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue ">
                  <input
                    placeholder="0.00"
                    // @ts-ignore
                    onWheel={(e) => e.target?.blur()} // prevent scroll
                    className="h-full w-full max-w-[60%]  bg-transparent p-2 font-mono focus:outline-none  "
                    type="number"
                    {...register(`maxLimit`)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 ">
                <WithQuestionTooltip
                  tooltipContent={
                    <QuestionTooltipContent
                      {...RebalancerFormTooltipCopy.trustee}
                    />
                  }
                >
                  <div className="h-fit pb-1 text-xs font-medium">
                    {RebalancerFormTooltipCopy.trustee.title}
                  </div>
                </WithQuestionTooltip>
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
