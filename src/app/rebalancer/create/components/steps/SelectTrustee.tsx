import { RadioGroup, RadioGroupItem } from "@/components";
import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";

import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import { useState } from "react";
import { cn } from "@/utils";

export const SelectTrustee: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const { register, setValue } = form;

  const [allowOtherAddressInput, setAllowOtherAddressInput] = useState(false);

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_Trustee.title}
        </h1>
        <div className="flex flex-col gap-2">
          <p className="w-3/4 text-sm ">
            {CreateRebalancerCopy.step_Trustee.subTitle}
          </p>
          <p className="w-3/4 text-sm ">
            {CreateRebalancerCopy.step_Trustee.info1}
          </p>
        </div>
      </div>
      <div>
        <div className="w-full pb-2 font-semibold">Trustee</div>
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
            <p>
              Only my wallet{" "}
              <span className="font-mono text-sm font-light">({address})</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value={TrusteeOptions.ThisWalletAndAnotherAddress}
              id={TrusteeOptions.ThisWalletAndAnotherAddress}
            />
            <p>My wallet and another address</p>
          </div>
        </RadioGroup>
        <div
          className={cn(
            "mt-2 w-3/4",
            allowOtherAddressInput
              ? "cursor-not-allowed border-valence-mediumgray bg-valence-mediumgray"
              : "border-valence-lightgray bg-valence-lightgray",
            " flex items-center border-[1.5px]  focus-within:border-valence-blue",
          )}
        >
          <input
            disabled={allowOtherAddressInput}
            className={cn(
              " font-mono",
              allowOtherAddressInput && "cursor-not-allowed bg-valence-gray",
              "h-full w-full bg-transparent p-2 transition-all focus:outline-none",
            )}
            type="text"
            placeholder="neutron1234..."
            {...register("trustee")}
          />
        </div>
      </div>
    </section>
  );
};

enum TrusteeOptions {
  OnlyThisWallet = "OnlyThisWallet",
  ThisWalletAndAnotherAddress = "ThisWalletAndAnotherAddress",
}
