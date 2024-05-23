"use client";
import { Button, Dropdown, NumberInput, TextInput } from "@/components";
import { Fragment, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsPlus, BsX } from "react-icons/bs";
import Image from "next/image";
import { FeatureFlags, cn } from "@/utils";
import { useQueryState } from "nuqs";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchHistoricalValues,
  fetchValenceAccountConfiguration,
  fetchLivePortfolio,
} from "@/server/actions";
import { Graph, Table, ValueTooltip } from "@/app/rebalancer/components";
import { GraphColor, Scale } from "@/app/rebalancer/const/graph";
import { QUERY_KEYS } from "@/const/query-keys";
import { useHistoricalValueGraph } from "@/app/rebalancer/hooks";
import { Label, Line, ReferenceLine, Tooltip } from "recharts";
import { UTCDate } from "@date-fns/utc";

const RebalancerPage = () => {
  const [baseDenom, setBaseDenom] = useQueryState("baseDenom", {
    defaultValue: "usd",
  });

  const [valenceAccount, setValenceAccount] = useQueryState("valenceAccount", {
    defaultValue: "",
  });

  const isValidValenceAccount = useMemo(() => {
    return !!valenceAccount && valenceAccount !== "";
  }, [valenceAccount]);

  const accountConfigQuery = useQuery({
    queryKey: [QUERY_KEYS.VALENCE_ACCOUNT_CONFIG, valenceAccount],
    queryFn: () =>
      fetchValenceAccountConfiguration({ address: valenceAccount }),
    enabled: isValidValenceAccount,
  });

  const isValidTargetDenoms = useMemo(() => {
    if (
      accountConfigQuery?.data?.targets &&
      accountConfigQuery?.data?.targets.length > 0
    )
      return true;
    return false;
  }, [accountConfigQuery?.data]);

  const targetDenoms = useMemo(() => {
    return accountConfigQuery?.data?.targets?.map((t) => t.denom) ?? [];
  }, [accountConfigQuery?.data]);

  const isFetchLivePortfolioEnabled = useMemo(() => {
    return (
      !!valenceAccount && !!baseDenom && !!targetDenoms && !!targetDenoms.length
    );
  }, [valenceAccount, baseDenom, targetDenoms]);

  const livePortfolioQuery = useQuery({
    queryKey: [
      QUERY_KEYS.LIVE_PORTFOLIO,
      valenceAccount,
      baseDenom,
      targetDenoms,
    ],
    queryFn: async () =>
      fetchLivePortfolio({
        address: valenceAccount,
        baseDenom: baseDenom,
        targetDenoms,
      }),
    enabled: isFetchLivePortfolioEnabled,
  });

  const historicalValuesQuery = useQuery({
    queryKey: [
      QUERY_KEYS.HISTORICAL_VALUES,
      valenceAccount,
      baseDenom,
      targetDenoms,
    ],
    queryFn: async () => {
      let startDate = new UTCDate();
      startDate.setHours(0, 0, 0, 0);

      return fetchHistoricalValues({
        targetDenoms: targetDenoms,
        baseDenom: baseDenom,
        address: valenceAccount,
        startDate: startDate,
        endDate: startDate, // nothing is done with this yet, its mock data
      });
    },
    enabled: isValidValenceAccount && isValidTargetDenoms,
  });

  const {
    scale,
    setScale,
    xAxisTicks,
    yAxisTicks,
    graphData,
    keys,
    todayTimestamp,
  } = useHistoricalValueGraph({
    data: historicalValuesQuery.data?.values,
    config: accountConfigQuery.data,
  });

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

  const REBALANCER_NON_USDC_VALUE_ENABLED = useMemo(() => {
    return FeatureFlags.REBALANCER_NON_USDC_VALUE_ENABLED();
  }, []);

  return (
    <main className="flex min-h-0 grow flex-col bg-valence-white text-valence-black">
      <div className="flex min-h-0 grow flex-row items-stretch">
        <div className="flex w-[24rem] shrink-0 flex-col items-stretch overflow-hidden overflow-y-auto border-r border-valence-black">
          <div className="flex flex-col gap-2 border-b border-valence-black px-4 pb-8">
            <Image
              className="mb-6 mt-8"
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              width={236}
              height={140}
            />

            <h1 className="text-xl font-bold">Rebalancer</h1>
            <p>
              To get started with the rebalancer, create a governance proposal
              to deposit funds into a valence account with a portfolio target.
            </p>
          </div>

          <div className="flex flex-col gap-6 border-b border-valence-black p-4 pb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold">Valence account</h1>

              <TextInput
                input={valenceAccount}
                onChange={setValenceAccount}
                placeholder="neutron12345..."
                textClassName="font-mono"
                containerClassName="w-full"
              />

              <Button className="mt-2" onClick={() => {}} disabled>
                Connect wallet
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-bold">Base token</p>

              <Dropdown
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
                      options={TOKEN_OPTIONS}
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
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="font-bold">P/I/D Preset</p>

              <Dropdown
                options={PID_PRESET_OPTIONS}
                selected={watch("pidPreset")}
                onSelected={(value) => setValue("pidPreset", value)}
              />
            </div>
          </div>
        </div>

        <div className="flex grow flex-col overflow-y-auto bg-valence-lightgray text-sm">
          <div className="flex flex-row items-stretch justify-between border-b border-valence-black px-4 py-2">
            {REBALANCER_NON_USDC_VALUE_ENABLED && (
              <Dropdown
                options={VALUE_BASE_OPTIONS}
                selected={baseDenom}
                onSelected={setBaseDenom}
              />
            )}

            <div className="flex flex-row items-center gap-8 pr-2">
              {scales.map((thisScale) => (
                <div
                  key={thisScale}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center text-base",
                    scale === thisScale
                      ? "text-valence-black"
                      : "text-valence-gray",
                  )}
                  onClick={() => setScale(thisScale as Scale)}
                >
                  <p>1{thisScale.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>

          <Graph
            scale={scale}
            xAxisTicks={xAxisTicks}
            yAxisTicks={yAxisTicks}
            data={graphData}
          >
            <Tooltip
              content={
                <ValueTooltip keys={[...keys.values, ...keys.projections]} />
              }
            />

            <ReferenceLine x={todayTimestamp} stroke="black" isFront>
              <Label
                value="Today"
                position="insideTopLeft"
                style={{ fill: "black" }}
                offset={10}
              />
            </ReferenceLine>
            {keys.values.map((k, i) => {
              return (
                <Fragment key={k}>
                  <Line
                    dataKey={k}
                    type="monotone"
                    dot={false}
                    stroke={GraphColor.get(i)}
                    isAnimationActive={false}
                  />
                </Fragment>
              );
            })}
            {keys.projections.map((k, i) => {
              return (
                <Fragment key={k}>
                  <Line
                    dataKey={k}
                    type="monotone"
                    dot={false}
                    stroke={GraphColor.get(i)}
                    isAnimationActive={false}
                    strokeDasharray="3 3"
                  />
                </Fragment>
              );
            })}
          </Graph>

          <div className="grow overflow-x-auto bg-valence-white">
            <Table />
          </div>
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

const scales = Object.values(Scale);

export type Token = {
  denom: string;
  percent: string;
};

export type RebalancerConfig = {
  baseToken: string;
  tokens: Token[];
  pidPreset: string;
};
