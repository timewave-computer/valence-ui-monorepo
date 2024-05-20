import { SortableTableHeader, Sorter } from "@/components";
import { Fragment, useState } from "react";
import { GraphColor } from "../const/graph";
import {
  atomPrices,
  ntrnPrices,
  osmoPrices,
  usdcPrices,
} from "@/const/mock-data";

export const Table: React.FC<{}> = () => {
  const [sorterKey, setSorter] = useState<string>("value");
  const [sortAscending, setSortAscending] = useState(true);
  const totalHoldings = REBALANCED_TOKENS.reduce(
    (acc, token) => acc + token.holdings,
    0,
  );

  const sorter = SORTERS.find((s) => s.key === sorterKey) ?? SORTERS[0];
  const sortedTokens = [...REBALANCED_TOKENS].sort((a, b) =>
    sorter.sort(a, b, sortAscending),
  );

  return (
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
            {(token.holdings * token.latestUsdPrice).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
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
  );
};

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
