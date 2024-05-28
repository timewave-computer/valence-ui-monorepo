"use client";
import { Dropdown, NumberInput } from "@/components";
import { USDC } from "@/const/mock-data";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { BsPlus, BsX } from "react-icons/bs";

export const ConfigPanel: React.FC<{
  config?: FetchAccountConfigReturnValue;
  isValidValenceAccount: boolean;
  isLoading?: boolean;
}> = ({ config, isValidValenceAccount, isLoading }) => {
  const { setValue, watch, control } = useForm<RebalancerConfig>({
    defaultValues: {
      pidPreset: "default",
    },
  });

  useEffect(() => {
    if (!isValidValenceAccount || !config) {
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
          percent: target.percentage.toString(),
        })),
      );
      setValue("baseToken", config.baseDenom);
      setValue("pidPreset", "default");
    }
  }, [setValue, config, isValidValenceAccount]);

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
      <div className="flex flex-col gap-3">
        <p className="font-bold">Base token</p>

        <Dropdown
          isLoading={isLoading}
          options={BASE_TOKEN_OPTIONS}
          selected={watch("baseToken")}
          onSelected={(value) => setValue("baseToken", value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <p className="font-bold">Tokens</p>
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
            <div className="flex flex-row items-stretch" key={id}>
              <Dropdown
                isLoading={isLoading}
                options={TOKEN_OPTIONS}
                selected={watch(`tokens.${index}.denom`)}
                onSelected={(value) => setValue(`tokens.${index}.denom`, value)}
                containerClassName="!min-w-[8rem] !border-r-0 pr-4"
              />

              <NumberInput
                containerClassName="grow"
                min={0.01}
                max={100}
                hidePlusMinus
                input={watch(`tokens.${index}.percent`)}
                onChange={(value) => setValue(`tokens.${index}.percent`, value)}
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
              <Dropdown
                isLoading={isLoading}
                options={[]}
                selected=""
                onSelected={() => {}}
              />{" "}
              <Dropdown
                isLoading={isLoading}
                options={[]}
                selected=""
                onSelected={() => {}}
              />
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-bold">P/I/D Preset</p>

        <Dropdown
          isLoading={isLoading}
          options={PID_PRESET_OPTIONS}
          selected={watch("pidPreset")}
          onSelected={(value) => setValue("pidPreset", value)}
        />
      </div>
    </>
  );
};

const BASE_TOKEN_OPTIONS: { label: string; value: string }[] = [
  {
    label: "USDC",
    value: USDC,
  },
  {
    label: "NTRN",
    value: "untrn",
  },
];

const TOKEN_OPTIONS: { label: string; value: string }[] = [
  {
    label: "USDC",
    value: USDC,
  },
  {
    label: "NTRN",
    value: "untrn",
  },
];

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
