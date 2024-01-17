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
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { simulate } from "@/utils";
import clsx from "clsx";

type Token = {
  denom: string;
  percent: string;
};

type RebalancedToken = {
  denom: string;
  symbol: string;
  name: string;
  color: string;
  holdings: number;
  usdPrice: number;
  target: number;
};

type RebalancerConfig = {
  baseToken: string;
  tokens: Token[];
  pidPreset: string;
};

const RebalancerPage = () => {
  const [valenceAccount, setValenceAccount] = useState("");
  const [valueBase, setValueBase] = useState("usd");
  const [sorterKey, setSorter] = useState<string>("value");
  const [sortAscending, setSortAscending] = useState(true);
  const [scale, setScale] = useState("y");

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

  const totalHoldings = REBALANCED_TOKENS.reduce(
    (acc, token) => acc + token.holdings,
    0
  );

  const sorter = SORTERS.find((s) => s.key === sorterKey) ?? SORTERS[0];

  // Last 9 months of ticks
  const ticksLast9Months = new Array(9)
    .fill(0)
    .map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
    .sort();

  const projection = useMemo(() => {
    // Simulate the next 90 days.
    const rebalances = simulate(
      0.3,
      0.2,
      0.1,
      90,
      REBALANCED_TOKENS.map(({ holdings, usdPrice, target }) => ({
        amount: holdings,
        price: usdPrice,
        target,
      }))
    );

    return rebalances.map((tokenAmounts, index) => ({
      timestamp: Date.now() + index * 24 * 60 * 60 * 1000,
      ...REBALANCED_TOKENS.reduce(
        (acc, { denom, usdPrice }, index) => ({
          ...acc,
          [denom]: {
            historical: null,
            projection: tokenAmounts[index] * usdPrice,
          },
        }),
        {} as Record<string, { historical: null; projection: number }>
      ),
    }));
  }, []);

  const data = [
    ...[...ticksLast9Months, projection[0].timestamp].map((timestamp) => ({
      timestamp,
      ...REBALANCED_TOKENS.reduce(
        (acc, { denom, holdings, usdPrice }) => ({
          ...acc,
          [denom]: {
            historical: holdings * usdPrice,
            projection: null,
          },
        }),
        {} as Record<string, { historical: number; projection: null }>
      ),
    })),
    ...projection,
  ];

  const sortedTokens = [...REBALANCED_TOKENS].sort((a, b) =>
    sorter.sort(a, b, sortAscending)
  );

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

        <div className="flex flex-col bg-valence-bg-gray text-sm grow overflow-y-auto">
          <div className="flex flex-row items-stretch justify-between border-b border-black p-4">
            <Dropdown
              options={VALUE_BASE_OPTIONS}
              selected={valueBase}
              onSelected={setValueBase}
            />

            <div className="flex flex-row gap-8 items-center pr-2">
              {scales.map((thisScale) => (
                <div
                  key={thisScale}
                  className={clsx(
                    "flex flex-col justify-center items-center cursor-pointer text-base",
                    scale === thisScale ? "text-black" : "text-gray-500"
                  )}
                  onClick={() => setScale(thisScale)}
                >
                  <p>1{thisScale.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer height={500}>
            <LineChart
              data={data}
              margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(time) => new Date(time).toLocaleDateString()}
                ticks={projection.map(({ timestamp }) => timestamp)}
                tickLine={false}
                axisLine={{ stroke: "white" }}
              />
              <Tooltip />
              <CartesianGrid syncWithTicks stroke="white" />
              <ReferenceLine x={Date.now()} stroke="black" isFront>
                <Label
                  value="Today"
                  position="insideTopLeft"
                  style={{ fill: "black" }}
                  offset={10}
                />
              </ReferenceLine>
              {REBALANCED_TOKENS.map(({ denom, color }) => (
                <Fragment key={denom}>
                  <Line
                    dataKey={denom + ".historical"}
                    type="monotone"
                    dot={false}
                    stroke={color}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey={denom + ".projection"}
                    type="monotone"
                    dot={false}
                    strokeDasharray="3 3"
                    stroke={color}
                  />
                </Fragment>
              ))}
            </LineChart>
          </ResponsiveContainer>

          <div className="bg-white grow">
            <div className="grid grid-cols-[2fr_2fr_3fr_4fr_4fr_2fr] border-t border-black">
              {/* Headers */}
              <SortableTableHeader
                label="Ticker"
                sorterKey="ticker"
                currentSorter={sorter}
                ascending={sortAscending}
                setSorter={setSorter}
                setSortAscending={setSortAscending}
              />

              <div className="border-b border-black"></div>

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
                  <div className="flex flex-row items-center gap-2 p-4 border-b border-black">
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: token.color }}
                    ></div>

                    <p className="font-bold text-sm">{token.name}</p>
                  </div>

                  <p className="p-4 border-b border-black flex flex-row items-center text-gray-500 text-sm">
                    {token.symbol}
                  </p>

                  <p className="p-4 border-b border-black flex flex-row items-center justify-end text-right font-mono text-sm">
                    {token.holdings.toLocaleString()}
                  </p>

                  <p className="p-4 border-b border-black flex flex-row items-center justify-end text-right font-mono text-sm">
                    $
                    {(token.holdings * token.usdPrice).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>

                  <p className="p-4 border-b border-black flex flex-row items-center justify-end text-right text-sm">
                    {((token.holdings / totalHoldings) * 100).toLocaleString(
                      undefined,
                      {
                        maximumSignificantDigits: 4,
                      }
                    )}
                    %
                  </p>

                  <p className="p-4 border-b border-black flex flex-row items-center justify-end text-right text-sm">
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

const REBALANCED_TOKENS: RebalancedToken[] = [
  {
    denom: "untrn",
    symbol: "NTRN",
    name: "Neutron",
    holdings: 169530000,
    usdPrice: 1.55,
    target: 0.2,
  },
  {
    denom: "uusdc",
    symbol: "USDC",
    name: "USDC",
    holdings: 42847124,
    usdPrice: 1,
    target: 0.1,
  },
  {
    denom: "uatom",
    symbol: "ATOM",
    name: "Atom",
    holdings: 32495823,
    usdPrice: 10.2,
    target: 0.4,
  },
  {
    denom: "uosmo",
    symbol: "OSMO",
    name: "Osmosis",
    holdings: 52817939,
    usdPrice: 1.76,
    target: 0.3,
  },
].map((token, index) => ({
  ...token,
  color: COLORS[index % COLORS.length],
}));

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
        ? a.holdings * a.usdPrice - b.holdings * b.usdPrice
        : b.holdings * b.usdPrice - a.holdings * a.usdPrice,
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

const data = [
  {
    name: "Page A",
    data: 4000,
    amt: 2400,
  },
  {
    name: "Page B",
    data: 3000,
    amt: 2210,
  },
  {
    name: "Page C",
    data: 9800,
    amt: 2290,
  },
];

const scales = ["h", "d", "w", "m", "y"];
