import { SortableTableHeader, Sorter } from "@/components";
import { Fragment, useMemo, useState } from "react";
import { GraphColor } from "../const/graph";
import { FetchLivePortfolioReturnValue, LiveHolding } from "@/server/actions";
import { useAtom } from "jotai";
import { denomColorIndexMap } from "@/ui-globals";
import { displayNumber } from "@/utils";

export const Table: React.FC<{
  livePortfolio?: FetchLivePortfolioReturnValue;
  isLoading?: boolean;
}> = ({ livePortfolio, isLoading }) => {
  const [sorterKey, setSorter] = useState<string>(SORTER_KEYS.VALUE);
  const [sortAscending, setSortAscending] = useState(true);
  const [colorIndexMap] = useAtom(denomColorIndexMap);
  const sorter = SORTERS.find((s) => s.key === sorterKey) ?? SORTERS[0];
  const sortedHoldings = livePortfolio?.portfolio?.length
    ? [...livePortfolio.portfolio].sort((a, b) =>
        sorter.sort(a, b, sortAscending),
      )
    : [];

  const totalValue = useMemo(() => {
    const total = livePortfolio?.portfolio.reduce((acc, holding) => {
      return acc + calcValue(holding);
    }, 0);
    return total ?? 0;
  }, [livePortfolio?.portfolio]);

  return (
    <>
      <div className="grid min-w-[668px] grid-cols-[0.5fr_1.5fr_1.5fr_1.5fr_1.5fr_1.5fr]">
        <SortableTableHeader
          label="Ticker"
          sorterKey={SORTER_KEYS.TICKER}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName=" justify-center"
        />
        <SortableTableHeader
          label="Holdings"
          sorterKey={SORTER_KEYS.HOLDINGS}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="justify-end "
        />
        <SortableTableHeader
          label="Price"
          sorterKey={SORTER_KEYS.PRICE}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="justify-end "
        />
        <SortableTableHeader
          label="USD Value"
          sorterKey={SORTER_KEYS.VALUE}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="justify-end "
        />

        <SortableTableHeader
          label="Distribution"
          sorterKey={SORTER_KEYS.DISTRIBUTION}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="justify-end"
        />
        <SortableTableHeader
          label="Target"
          sorterKey={SORTER_KEYS.TARGET}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="justify-end"
        />

        {!isLoading && (
          <>
            {sortedHoldings.length === 0 && <EmptyRow />}
            {sortedHoldings.map((holding, index) => (
              <Fragment key={index}>
                <div className="flex flex-row items-center justify-start gap-2 border-b border-valence-black p-4">
                  <div
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{
                      backgroundColor: GraphColor.get(
                        colorIndexMap[holding.denom],
                      ),
                    }}
                  ></div>
                  <p className="text-sm font-bold">{holding.asset.name}</p>
                </div>
                <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
                  {displayNumber(holding.amount, { precision: null })}
                </p>
                <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
                  ${displayNumber(holding.price, { precision: 2 })}
                </p>
                <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
                  ${displayNumber(calcValue(holding), { precision: 2 })}
                </p>
                <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
                  {displayNumber(holding.distribution * 100, { precision: 2 })}%
                </p>
                <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
                  {displayNumber(holding.target * 100, { precision: 2 })}%
                </p>
              </Fragment>
            ))}

            {sortedHoldings.length !== 0 && (
              <TotalValueRow total={totalValue} />
            )}
          </>
        )}
      </div>
      {isLoading && <LoadingRows />}
    </>
  );
};

function doCompare<T extends string>(a: T, b: T, ascending: boolean) {
  return ascending ? a.localeCompare(b) : b.localeCompare(a);
}

function calcValue(holding: LiveHolding) {
  return holding.amount * holding.price;
}

enum SORTER_KEYS {
  TICKER = "ticker",
  HOLDINGS = "holdings",
  PRICE = "price",
  VALUE = "value",
  DISTRIBUTION = "distribution",
  TARGET = "target",
}

const SORTERS: Sorter<LiveHolding>[] = [
  {
    key: SORTER_KEYS.TICKER,
    sort: (a, b, ascending) =>
      doCompare(a.asset?.name ?? "", b.asset?.name ?? "", ascending),
  },
  {
    key: SORTER_KEYS.HOLDINGS,
    sort: (a, b, ascending) =>
      doCompare(String(a.amount), String(b.amount), ascending),
  },
  {
    key: SORTER_KEYS.PRICE,

    sort: (a, b, ascending) =>
      doCompare(String(a.price), String(b.price), ascending),
  },
  {
    key: SORTER_KEYS.VALUE,

    sort: (a, b, ascending) =>
      doCompare(String(calcValue(a)), String(calcValue(b)), ascending),
  },
  {
    key: SORTER_KEYS.DISTRIBUTION,

    sort: (a, b, ascending) =>
      doCompare(String(a.distribution), String(b.distribution), ascending),
  },
  {
    key: SORTER_KEYS.TARGET,
    sort: (a, b, ascending) =>
      doCompare(String(a.target), String(b.target), ascending),
  },
];

const EmptyRow = () => (
  <>
    <div className="flex flex-row items-center justify-center gap-2 border-b border-valence-black p-4">
      <p className="text-center text-sm font-bold">{"-"}</p>
    </div>
    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
      {"0.00"}
    </p>

    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
      {"$0.00"}
    </p>

    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
      {"$0.00"}
    </p>

    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
      {"0%"}
    </p>
    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm">
      {"0%"}
    </p>
  </>
);

const TotalValueRow: React.FC<{ total: number }> = ({ total }) => (
  <>
    <p className=" flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm"></p>
    <p className="flex flex-row items-center  justify-end border-b border-valence-black p-4 text-sm font-bold">
      Total Value
    </p>
    <p className="flex flex-row items-center justify-end border-b border-valence-black p-4 text-right font-mono text-sm font-bold">
      ${displayNumber(total, { precision: 2 })}
    </p>
  </>
);

const LoadingRows = () => (
  <div className="flex flex-col gap-0.5">
    <div className="min-h-12 animate-pulse bg-valence-lightgray"></div>
    <div className="min-h-12 animate-pulse bg-valence-lightgray"></div>
    <div className="min-h-12 animate-pulse bg-valence-lightgray"></div>
  </div>
);
