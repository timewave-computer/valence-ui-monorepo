"use client";
import {
  Button,
  Dropdown,
  NumberInput,
  SortableTableHeader,
  Sorter,
  TextInput,
} from "@/components";
import { Fragment, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { BsPlus, BsX } from "react-icons/bs";
import Image from "next/image";
import {
  atomPrices,
  ntrnPrices,
  osmoPrices,
  usdcPrices,
} from "@/const/mock-data";
import { cn } from "@/utils";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import {
  fetchHistoricalValues,
  fetchValenceAccountConfiguration,
  fetchLivePortfolio,
} from "@/server/actions";
import { Graph, ValueTooltip } from "@/app/rebalancer/components";
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

  const livePortfolioQuery = useQuery({
    queryKey: [QUERY_KEYS.LIVE_PORTFOLIO, valenceAccount, baseDenom],
    queryFn: () =>
      fetchLivePortfolio({ address: valenceAccount, baseDenom: baseDenom }),
    enabled: isValidValenceAccount,
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

  const [sorterKey, setSorter] = useState<string>("value");
  const [sortAscending, setSortAscending] = useState(true);

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

  const totalHoldings = REBALANCED_TOKENS.reduce(
    (acc, token) => acc + token.holdings,
    0,
  );
  const sorter = SORTERS.find((s) => s.key === sorterKey) ?? SORTERS[0];
  const sortedTokens = [...REBALANCED_TOKENS].sort((a, b) =>
    sorter.sort(a, b, sortAscending),
  );

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
            <Dropdown
              options={VALUE_BASE_OPTIONS}
              selected={baseDenom}
              onSelected={setBaseDenom}
            />

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
            <div className="grid grid-cols-[2fr_2fr_3fr_4fr_4fr_2fr]">
              <SortableTableHeader
                label="Ticker"
                sorterKey="ticker"
                currentSorter={sorter}
                ascending={sortAscending}
                setSorter={setSorter}
                setSortAscending={setSortAscending}
              />

              <div className="border-y border-valence-black"></div>

              <SortableTableHeader
                label="Holdings"
                sorterKey="holdings"
                currentSorter={sorter}
                ascending={sortAscending}
                setSorter={setSorter}
                setSortAscending={setSortAscending}
                buttonClassName="justify-end text-right"
              />

              <SortableTableHeader
                label="Est. USD Value"
                sorterKey="value"
                currentSorter={sorter}
                ascending={sortAscending}
                setSorter={setSorter}
                setSortAscending={setSortAscending}
                buttonClassName="justify-end text-right"
              />

              <SortableTableHeader
                label="Distribution"
                sorterKey="distribution"
                currentSorter={sorter}
                ascending={sortAscending}
                setSorter={setSorter}
                setSortAscending={setSortAscending}
                buttonClassName="justify-end text-right"
              />

              <SortableTableHeader
                label="Target"
                sorterKey="target"
                currentSorter={sorter}
                ascending={sortAscending}
                setSorter={setSorter}
                setSortAscending={setSortAscending}
                buttonClassName="justify-end text-right"
              />

              {sortedTokens.map((token, index) => (
                <Fragment key={index}>
                  <div className="flex flex-row items-center gap-2 border-b border-valence-black p-4">
                    <div
                      className="h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: token.color }}
                    ></div>

                    <p className="text-sm font-bold">{token.name}</p>
                  </div>

                  <p className="flex flex-row items-center border-b border-valence-black p-4 text-sm text-valence-gray">
                    {token.symbol}
                  </p>

                  <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
                    {token.holdings.toLocaleString()}
                  </p>

                  <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
                    $
                    {(token.holdings * token.latestUsdPrice).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </p>

                  <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right text-sm">
                    {((token.holdings / totalHoldings) * 100).toLocaleString(
                      undefined,
                      {
                        maximumSignificantDigits: 4,
                      },
                    )}
                    %
                  </p>

                  <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right text-sm">
                    {(token.target * 100).toLocaleString(undefined, {
                      maximumSignificantDigits: 4,
                    })}
                    %
                  </p>
                </Fragment>
              ))}
            </div>
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

const REBALANCED_TOKENS = (
  [
    {
      denom: "untrn",
      symbol: "NTRN",
      name: "Neutron",
      holdings: 569537,
      osmosisPrices: ntrnPrices,
      target: 0.2,
    },
    {
      denom: "uusdc",
      symbol: "USDC",
      name: "USDC",
      holdings: 428471,
      osmosisPrices: usdcPrices,
      target: 0.1,
    },
    {
      denom: "uatom",
      symbol: "ATOM",
      name: "Atom",
      holdings: 32495,
      osmosisPrices: atomPrices,
      target: 0.4,
    },
    {
      denom: "uosmo",
      symbol: "OSMO",
      name: "Osmosis",
      holdings: 662817,
      osmosisPrices: osmoPrices,
      target: 0.3,
    },
  ] as Omit<RebalancedToken, "latestUsdPrice" | "color">[]
).map((token, index) => {
  // Descending.
  token.osmosisPrices.reverse();

  return {
    ...token,
    latestUsdPrice: token.osmosisPrices[0].close,
    color: GraphColor.get(index),
  };
});

const SORTERS: Sorter<RebalancedToken>[] = [
  {
    key: "ticker",
    sort: (a, b, ascending) =>
      ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  },
  {
    key: "holdings",
    sort: (a, b, ascending) =>
      ascending ? a.holdings - b.holdings : b.holdings - a.holdings,
  },
  {
    key: "value",
    sort: (a, b, ascending) =>
      ascending
        ? a.holdings * a.latestUsdPrice - b.holdings * b.latestUsdPrice
        : b.holdings * b.latestUsdPrice - a.holdings * a.latestUsdPrice,
  },
  {
    key: "distribution",
    sort: (a, b, ascending) =>
      ascending ? a.holdings - b.holdings : b.holdings - a.holdings,
  },
  {
    key: "target",
    sort: (a, b, ascending) =>
      ascending ? a.target - b.target : b.target - a.target,
  },
];

const scales = Object.values(Scale);

type OsmosisPrice = {
  time: number;
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number | null;
};

type RebalancedToken = {
  denom: string;
  symbol: string;
  name: string;
  color: string;
  holdings: number;
  latestUsdPrice: number;
  osmosisPrices: OsmosisPrice[];
  target: number;
};

export type Token = {
  denom: string;
  percent: string;
};

export type RebalancerConfig = {
  baseToken: string;
  tokens: Token[];
  pidPreset: string;
};
