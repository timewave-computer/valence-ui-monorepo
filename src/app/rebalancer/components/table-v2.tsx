"use client";
import { SortableTableHeader, Sorter } from "@/components";
import { Fragment, useMemo, useState } from "react";
import { SymbolColors } from "@/app/rebalancer/const/graph";
import { cn, displayNumber } from "@/utils";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { UseLivePortfolioReturnValue } from "@/app/rebalancer/hooks";
import { AccountTarget } from "@/server/actions";

export type TableData = {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  distribution: number;
  target: number;
  auction: number;
};

export const TableV2: React.FC<{
  livePortfolio?: UseLivePortfolioReturnValue["data"];
  isLoading?: boolean;
  targets: AccountTarget[];
}> = ({ livePortfolio, isLoading, targets = [] }) => {
  const [sorterKey, setSorter] = useState<string>(SORTER_KEYS.VALUE);
  const [sortAscending, setSortAscending] = useState(true);
  const sorter = SORTERS.find((s) => s.key === sorterKey) ?? SORTERS[0];

  const tableData: TableData[] = useMemo(() => {
    if (!livePortfolio) return [];
    const formatted = livePortfolio.map((lineItem) => {
      const target = targets.find((t) => t.denom === lineItem.denom);

      return {
        symbol: lineItem.symbol,
        name: lineItem.name,
        amount: lineItem.balance.total,
        auction: lineItem.balance.auction,
        price: lineItem.price,
        distribution: lineItem.distribution,
        target: target?.percentage ?? 0,
      };
    });
    return formatted.sort((a, b) => sorter.sort(a, b, sortAscending));
  }, [sortAscending, sorter, livePortfolio, targets]);

  const totalValue = useMemo(() => {
    const total = tableData?.reduce((acc, holding) => {
      return acc + calcValue(holding);
    }, 0);
    return total ?? 0;
  }, [tableData]);

  return (
    <>
      <div className="grid grid-cols-[0.5fr_1fr_1fr_1.5fr_1.5fr_1fr_1.5fr]">
        <SortableTableHeader
          label="Ticker"
          sorterKey={SORTER_KEYS.TICKER}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="pt-0 justify-start px-0  border-y-0"
          textClassName=" text-xs font-base "
        />

        <SortableTableHeader
          label="Distribution"
          sorterKey={SORTER_KEYS.DISTRIBUTION}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="pt-0 justify-end px-0 border-y-0"
          textClassName=" text-xs font-base "
        />
        <SortableTableHeader
          label="Target"
          sorterKey={SORTER_KEYS.TARGET}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="pt-0 justify-end px-0 border-y-0"
          textClassName=" text-xs font-base "
        />
        <SortableTableHeader
          label="Holdings in Auction"
          sorterKey={SORTER_KEYS.HOLDINGS}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="pt-0 justify-end px-0  border-y-0"
          textClassName=" text-xs font-base "
        />
        <SortableTableHeader
          label="Total Holdings"
          sorterKey={SORTER_KEYS.HOLDINGS}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="pt-0 justify-end px-0  border-y-0"
          textClassName=" text-xs font-base "
        />
        <SortableTableHeader
          label="Price"
          sorterKey={SORTER_KEYS.PRICE}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="pt-0 justify-end px-0  border-y-0"
          textClassName=" text-xs font-base "
        />

        <SortableTableHeader
          label="USD Value"
          sorterKey={SORTER_KEYS.VALUE}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="pt-0 justify-end  border-y-0 px-0"
          textClassName=" text-xs font-base "
        />

        {!isLoading && (
          <>
            {tableData.length === 0 && <EmptyRow />}
            {tableData.map((holding, index) => {
              return (
                <Fragment key={index}>
                  <div
                    className={cn(
                      index === 0 && "border-b border-t",
                      "flex flex-row items-center justify-start gap-2 border-b border-valence-mediumgray px-0 py-4",
                    )}
                  >
                    <div
                      className="h-4 w-4 shrink-0 rounded-full"
                      style={{
                        backgroundColor: SymbolColors.get(holding.symbol),
                      }}
                    ></div>
                    <p className="text-sm font-bold">{holding.name}</p>
                  </div>

                  <p
                    className={cn(
                      index === 0 && "border-b border-t",
                      "flex flex-row items-center justify-end border-b border-valence-mediumgray py-4 text-right font-mono text-sm",
                    )}
                  >
                    {displayNumber(holding.distribution * 100, {
                      precision: 2,
                    })}
                    %
                  </p>
                  <p
                    className={cn(
                      index === 0 && "border-b border-t",
                      "flex flex-row items-center justify-end border-b border-valence-mediumgray py-4 pr-0 text-right font-mono text-sm",
                    )}
                  >
                    {displayNumber(holding.target * 100, { precision: 2 })}%
                  </p>
                  <p
                    className={cn(
                      index === 0 && "border-b border-t",
                      "flex flex-row items-center justify-end border-b border-valence-mediumgray py-4 text-right font-mono text-sm",
                    )}
                  >
                    {displayNumber(holding.auction, { precision: 2 })}
                  </p>
                  <p
                    className={cn(
                      index === 0 && "border-b border-t",
                      "flex flex-row items-center justify-end border-b border-valence-mediumgray py-4 text-right font-mono text-sm",
                    )}
                  >
                    {displayNumber(holding.amount, { precision: 2 })}
                  </p>
                  <p
                    className={cn(
                      index === 0 && "border-b border-t",
                      "flex flex-row items-center justify-end border-b border-valence-mediumgray py-4 text-right font-mono text-sm",
                    )}
                  >
                    ${displayNumber(holding.price, { precision: 2 })}
                  </p>
                  <p
                    className={cn(
                      index === 0 && "border-b border-t",
                      "flex flex-row items-center justify-end border-b border-valence-mediumgray py-4 text-right font-mono text-sm",
                    )}
                  >
                    ${displayNumber(calcValue(holding), { precision: 2 })}
                  </p>
                </Fragment>
              );
            })}

            {tableData.length !== 0 && <TotalValueRow total={totalValue} />}
          </>
        )}
        {isLoading && <LoadingRows />}
      </div>
    </>
  );
};

function compareStrings<T extends string>(a: T, b: T, ascending: boolean) {
  return ascending ? a.localeCompare(b) : b.localeCompare(a);
}
function compareNumbers<T extends number>(a: T, b: T, ascending: boolean) {
  return ascending ? a - b : b - a;
}

function calcValue(holding: TableData) {
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

export const SORTERS: Sorter<TableData>[] = [
  {
    key: SORTER_KEYS.TICKER,
    sort: (a, b, ascending) => compareStrings(a.symbol, b.symbol, ascending),
  },
  {
    key: SORTER_KEYS.HOLDINGS,
    sort: (a, b, ascending) => compareNumbers(a.amount, b.amount, ascending),
  },
  {
    key: SORTER_KEYS.PRICE,

    sort: (a, b, ascending) => compareNumbers(a.price, b.price, ascending),
  },
  {
    key: SORTER_KEYS.VALUE,

    sort: (a, b, ascending) =>
      compareNumbers(calcValue(a), calcValue(b), ascending),
  },
  {
    key: SORTER_KEYS.DISTRIBUTION,

    sort: (a, b, ascending) =>
      compareNumbers(a.distribution, b.distribution, ascending),
  },
  {
    key: SORTER_KEYS.TARGET,
    sort: (a, b, ascending) => compareNumbers(a.target, b.target, ascending),
  },
];

const EmptyRow = () => (
  <>
    <div className="flex flex-row items-center justify-start gap-2 border-t border-valence-mediumgray p-4 pl-1">
      <p className="text-center text-sm font-bold">{"-"}</p>
    </div>

    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray p-4 text-right font-mono text-sm">
      {"0%"}
    </p>
    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray p-4 pr-0 text-right font-mono text-sm">
      {"0%"}
    </p>
    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray p-4 text-right font-mono text-sm">
      {"0.00"}
    </p>
    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray p-4 text-right font-mono text-sm">
      {"0.00"}
    </p>

    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray p-4 text-right font-mono text-sm">
      {"$0.00"}
    </p>

    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray p-4 text-right font-mono text-sm">
      {"$0.00"}
    </p>
  </>
);

const TotalValueRow: React.FC<{ total: number }> = ({ total }) => (
  <>
    <p className=" flex flex-row items-center border-valence-mediumgray p-4 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center border-valence-mediumgray p-4 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center border-valence-mediumgray p-4 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center border-valence-mediumgray p-4 text-right font-mono text-sm"></p>
    <p className="flex flex-row items-center  justify-end border-valence-mediumgray py-0 text-xs font-bold">
      Total Value
    </p>
    <p className="flex flex-row items-center justify-end  border-valence-mediumgray py-4 text-right font-mono text-xs font-bold">
      ${displayNumber(total, { precision: 2 })}
    </p>
  </>
);

const LoadingRows = () => (
  <div className="col-span-full flex flex-col gap-0.5">
    <LoadingSkeleton className="min-h-12" />
    <LoadingSkeleton className="min-h-12" />
    <LoadingSkeleton className="min-h-12" />
  </div>
);
