"use client";

import { Button, Dropdown, NumberInput, TextInput } from "@/components";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsPlus, BsX } from "react-icons/bs";
import Image from "next/image";

type RebalancerConfig = {
  baseToken: string;
  tokens: Token[];
  pidPreset: string;
};

const RebalancerPage = () => {
  const [valenceAccount, setValenceAccount] = useState("");
  const [valueBase, setValueBase] = useState("usd");

  const { setValue, watch, control } = useForm<RebalancerConfig>({
    defaultValues: {
      baseToken: "uusdc",
      tokens: [
        {
          denom: "untrn",
          percent: "33.33",
        },
        {
          denom: "uatom",
          percent: "33.33",
        },
        {
          denom: "uusdc",
          percent: "33.33",
        },
      ],
      pidPreset: "default",
    },
  });
  const {
    fields: tokenFields,
    append: addToken,
    remove: removeToken,
  } = useFieldArray({
    control,
    name: "tokens",
  });

  const onConnect = () => {
    // TODO
  };

  return (
    <main className="flex grow min-h-0 flex-col bg-white text-black">
      <div className="flex flex-row items-stretch grow min-h-0">
        <div className="overflow-y-auto flex flex-col items-stretch w-[24rem] shrink-0 border-r border-black overflow-hidden">
          <div className="px-4 py-6 flex flex-col gap-2 border-b-2 border-black">
            <Image
              src="/img/rebalancer.png"
              alt="Rebalancer illustration"
              width={140}
              height={83}
            />

            <h1 className="text-xl font-bold mt-2">Rebalancer</h1>

            <p className="text-sm">
              To get started with the rebalancer, create a governance proposal
              to deposit funds into a valence account with a portfolio target.
            </p>
          </div>

          <div className="p-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-base font-medium">Valence account</h1>

              <TextInput
                input={valenceAccount}
                onChange={setValenceAccount}
                style="ghost"
                placeholder="neutron12345..."
                textClassName="font-mono"
                containerClassName="w-full"
              />
            </div>

            <Button onClick={onConnect}>Connect</Button>

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium">Base token</p>

              <Dropdown
                options={BASE_TOKEN_OPTIONS}
                selected={watch("baseToken")}
                onSelected={(value) => setValue("baseToken", value)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <p className="text-base font-medium">Tokens</p>
                <button
                  className="flex flex-row justify-center items-center"
                  onClick={() =>
                    addToken({
                      denom: "uusdc",
                      percent: "25",
                    })
                  }
                >
                  <BsPlus className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {tokenFields.map(({ id }, index) => (
                  <div className="flex flex-row gap-2 items-stretch" key={id}>
                    <Dropdown
                      options={TOKEN_OPTIONS}
                      selected={watch(`tokens.${index}.denom`)}
                      onSelected={(value) =>
                        setValue(`tokens.${index}.denom`, value)
                      }
                      containerClassName="!min-w-[8rem]"
                    />

                    <NumberInput
                      containerClassName="grow"
                      min={0.01}
                      max={100}
                      input={watch(`tokens.${index}.percent`)}
                      onChange={(value) =>
                        setValue(`tokens.${index}.percent`, value)
                      }
                      unit="%"
                    />

                    <button
                      className="flex flex-row justify-center items-center"
                      onClick={() => removeToken(index)}
                    >
                      <BsX className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-base font-medium">P/I/D Preset</p>

              <Dropdown
                options={PID_PRESET_OPTIONS}
                selected={watch("pidPreset")}
                onSelected={(value) => setValue("pidPreset", value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-valence-gray text-sm grow">
          <div className="flex flex-row items-stretch justify-between border-b border-black p-4">
            <Dropdown
              options={VALUE_BASE_OPTIONS}
              selected={valueBase}
              onSelected={setValueBase}
            />

            <div className="flex flex-row gap-8 items-center pr-2">
              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {}}
              >
                <p>1H</p>
              </div>

              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {}}
              >
                <p>1D</p>
              </div>

              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {}}
              >
                <p>1W</p>
              </div>

              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {}}
              >
                <p>1M</p>
              </div>

              <div
                className="flex flex-col justify-center items-center cursor-pointer"
                onClick={() => {}}
              >
                <p>1Y</p>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto text-xs flex flex-col gap-4 font-mono text-black grow p-8"></div>
        </div>
      </div>
    </main>
  );
};

export default RebalancerPage;

const BASE_TOKEN_OPTIONS: { label: string; value: string }[] = [
  {
    label: "USDC",
    value: "uusdc",
  },
  {
    label: "NTRN",
    value: "untrn",
  },
  {
    label: "ATOM",
    value: "uatom",
  },
];

const TOKEN_OPTIONS: { label: string; value: string }[] = [
  {
    label: "USDC",
    value: "uusdc",
  },
  {
    label: "NTRN",
    value: "untrn",
  },
  {
    label: "ATOM",
    value: "uatom",
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

const VALUE_BASE_OPTIONS: { label: string; value: string }[] = [
  {
    label: "Est. USD Value",
    value: "usd",
  },
  {
    label: "Base Token Value",
    value: "baseToken",
  },
];

type Token = {
  denom: string;
  percent: string;
};

const COLORS = [
  "#FF2A00",
  "#00A3FF",
  "#EA80D1",
  "#4EBB5B",
  "#FFBC57",
  "#800000",
  "#BABABA",
  "#C2C600",
  "#8476DE",
  "#17CFCF",
];
