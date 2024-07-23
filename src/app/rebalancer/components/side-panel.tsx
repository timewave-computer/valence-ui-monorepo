"use client";
import { Button, Dropdown, DropdownTextField, NumberInput } from "@/components";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsPlus, BsX } from "react-icons/bs";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { useEdgeConfig } from "@/hooks";
import {
  DEFAULT_ACCOUNT,
  DEFAULT_FEATURED_ACCOUNTS,
  accountAtom,
} from "@/app/rebalancer/const";
import { useAtom } from "jotai";
import { useQueryState } from "nuqs";

export const SidePanel: React.FC<{
  isLoading: boolean;
  isValidAccount: boolean;
  debouncedMouseEnter: () => void;
  debouncedMouseLeave: () => void;
}> = ({
  isLoading,
  isValidAccount,
  debouncedMouseEnter,
  debouncedMouseLeave,
}) => {
  const queryClient = useQueryClient();
  const [accountUrlParam, setAccountUrlParam] = useQueryState("account", {
    defaultValue: DEFAULT_ACCOUNT,
  });
  const [account, setAccount] = useAtom(accountAtom);
  useMemo(() => {
    setAccount(accountUrlParam);
  }, [setAccount, accountUrlParam]);

  const config = queryClient.getQueryData<FetchAccountConfigReturnValue>([
    QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG,
    account,
  ]);
  const { data } = useEdgeConfig();

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
      <div className="flex flex-col gap-2 border-b border-valence-black p-4 ">
        <h1 className="font-bold">Rebalancer account</h1>

        <DropdownTextField
          options={
            data?.featured_rebalancer_accounts ?? DEFAULT_FEATURED_ACCOUNTS
          }
          value={account}
          onChange={(value) => setAccountUrlParam(value)}
          placeholder="neutron12345..."
        />

        <Button
          onMouseMove={debouncedMouseEnter}
          onMouseEnter={debouncedMouseEnter}
          onMouseLeave={debouncedMouseLeave}
          className="mt-2"
          onClick={() => {}}
          disabled
        >
          Connect wallet
        </Button>
      </div>

      <div className="relative flex grow flex-col border-b  border-valence-black">
        <div
          onMouseMove={debouncedMouseEnter}
          onMouseEnter={debouncedMouseEnter}
          onMouseLeave={debouncedMouseLeave}
          className="absolute z-10 flex h-full w-full flex-col bg-valence-black/25"
        />

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
                  <Dropdown
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
              {/* dummy component for empty state */}
              {tokenFields.length === 0 && !isLoading && (
                <div className="flex flex-row items-stretch">
                  <Dropdown
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
            <Dropdown
              isLoading={isLoading}
              options={PID_PRESET_OPTIONS}
              selected={watch("pidPreset")}
              onSelected={(value) => setValue("pidPreset", value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-bold">Base token</p>
            <Dropdown
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
