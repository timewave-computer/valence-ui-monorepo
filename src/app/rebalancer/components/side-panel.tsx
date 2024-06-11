"use client";
import {
  Button,
  DropdownDEPRECATED,
  DropdownOption,
  DropdownTextField,
  NumberInput,
} from "@/components";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { BsPlus, BsX } from "react-icons/bs";
import { ComingSoonTooltipContent, TooltipWrapper } from "@/components";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";

export const SidePanel: React.FC<{
  account: string;
  setAccount: (s: string) => void;
  isLoading: boolean;
  isValidAccount: boolean;
}> = ({ account, setAccount, isLoading, isValidAccount }) => {
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<FetchAccountConfigReturnValue>([
    QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG,
    account,
  ]);

  const { setValue, watch, control } = useForm<RebalancerConfig>({
    defaultValues: {
      pidPreset: "default",
    },
  });

  const tokenOptions =
    config?.targets.map((target) => ({
      label: target.asset.recommended_symbol ?? target.asset.symbol,
      value: target.denom,
    })) ?? [];

  useEffect(() => {
    if (!isValidAccount || !config) {
      // clear
      setValue("tokens", []);
      setValue("baseToken", "");
      setValue("pidPreset", "");
      return;
    } else {
      setValue(
        "tokens",
        config.targets.map((target) => ({
          denom: target.denom,
          percent: (target.percentage * 100).toString(),
        })),
      );
      setValue("baseToken", config.baseDenom);
      setValue("pidPreset", "default");
    }
  }, [setValue, config, isValidAccount]);

  const {
    fields: tokenFields,
    append: addToken,
    remove: removeToken,
  } = useFieldArray({
    control,
    name: "tokens",
  });

  return (
    <>
      <div className="flex flex-col  gap-6 border-b border-valence-black p-4 pb-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold">Rebalancer account</h1>

          <DropdownTextField
            options={FEATURED_ACCOUNTS_OPTIONS}
            value={account}
            onChange={(value) => setAccount(value)}
            placeholder="neutron12345..."
          />
          <TooltipWrapper
            sideOffset={24}
            asChild
            content={<ComingSoonTooltipContent />}
          >
            <Button className="mt-2" onClick={() => {}} disabled>
              Connect wallet
            </Button>
          </TooltipWrapper>
        </div>
      </div>

      <div className="relative flex grow flex-col border-b border-valence-black ">
        <TooltipWrapper
          sideOffset={10}
          asChild
          content={<ComingSoonTooltipContent />}
        >
          <div className="absolute z-10 flex h-full w-full flex-col bg-valence-gray/40  " />
        </TooltipWrapper>

        <div className="flex flex-col  gap-6 p-4 pb-8 ">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center justify-between">
              <p className="font-bold">Asset Targets</p>
              <button
                className="flex flex-row items-center justify-center"
                onClick={() =>
                  addToken({
                    denom: "uusdc",
                    percent: "25",
                  })
                }
              >
                <BsPlus className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {tokenFields.map(({ id }, index) => (
                <div
                  key={`tokens-${id}`}
                  className="flex flex-row items-stretch"
                >
                  <DropdownDEPRECATED
                    isLoading={isLoading}
                    options={tokenOptions}
                    selected={watch(`tokens.${index}.denom`)}
                    onSelected={(value) =>
                      setValue(`tokens.${index}.denom`, value)
                    }
                    containerClassName="!min-w-[8rem] !border-r-0 pr-4"
                  />

                  <NumberInput
                    containerClassName="grow"
                    min={0.01}
                    max={100}
                    hidePlusMinus
                    input={watch(`tokens.${index}.percent`)}
                    onChange={(value) =>
                      setValue(`tokens.${index}.percent`, value)
                    }
                    unit="%"
                  />

                  <button
                    className="ml-3 flex flex-row items-center justify-center"
                    onClick={() => removeToken(index)}
                  >
                    <BsX className="h-6 w-6" />
                  </button>
                </div>
              ))}
              {/* dummy component for loading state */}
              {tokenFields.length === 0 && isLoading && (
                <>
                  {" "}
                  <DropdownDEPRECATED
                    isLoading={isLoading}
                    options={[]}
                    selected=""
                    onSelected={() => {}}
                  />{" "}
                  <DropdownDEPRECATED
                    isLoading={isLoading}
                    options={[]}
                    selected=""
                    onSelected={() => {}}
                  />
                </>
              )}
              {/* dummy component for empty state */}
              {tokenFields.length === 0 && !isLoading && (
                <div className="flex flex-row items-stretch">
                  <DropdownDEPRECATED
                    isLoading={isLoading}
                    options={tokenOptions}
                    selected=""
                    onSelected={() => {}}
                    containerClassName="!min-w-[8rem] !border-r-0 pr-4"
                  />

                  <NumberInput
                    containerClassName="grow"
                    min={0.01}
                    max={100}
                    hidePlusMinus
                    input={""}
                    placeholder="0.00"
                    onChange={() => {}}
                    unit="%"
                  />

                  <button
                    className="ml-3 flex flex-row items-center justify-center"
                    onClick={() => {}}
                  >
                    <BsX className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-bold">Rebalance Speed</p>
            <DropdownDEPRECATED
              isLoading={isLoading}
              options={PID_PRESET_OPTIONS}
              selected={watch("pidPreset")}
              onSelected={(value) => setValue("pidPreset", value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-bold">Base token</p>
            <DropdownDEPRECATED
              isLoading={isLoading}
              options={tokenOptions}
              selected={watch("baseToken")}
              onSelected={(value) => setValue("baseToken", value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const PID_PRESET_OPTIONS: { label: string; value: string }[] = [
  {
    label: "Default",
    value: "default",
  },
  {
    label: "Correct faster",
    value: "faster",
  },
  {
    label: "Correct slower",
    value: "slower",
  },
];

export type RebalancerConfig = {
  baseToken: string;
  tokens: Token[];
  pidPreset: string;
};

export type Token = {
  denom: string;
  percent: string;
};

const FEATURED_ACCOUNTS_OPTIONS: DropdownOption<string>[] =
  process.env.NODE_ENV === "development"
    ? [
        {
          label: "Timewave Rebalancer",
          value:
            "neutron13pvwjc3ctlv53u9c543h6la8e2cupkwcahe5ujccdc4nwfgann7ss0xynz",
        },
        {
          label: "DEV: Lena DAO Rebalancer",
          value:
            "neutron1vw0zuapgkpnq49ffyvkt4s4chy9lnf78s2ezuwwvd95lq065fpes277xkt",
        },
      ]
    : [
        {
          label: "Timewave Rebalancer",
          value:
            "neutron13pvwjc3ctlv53u9c543h6la8e2cupkwcahe5ujccdc4nwfgann7ss0xynz",
        },
      ];
