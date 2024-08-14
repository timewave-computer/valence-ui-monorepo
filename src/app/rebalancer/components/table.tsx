"use client";
import { SortableTableHeader, Sorter } from "@/components";
import { Fragment, useMemo, useState } from "react";
import { SymbolColors } from "@/app/rebalancer/const/graph";
import { displayNumber } from "@/utils";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { UseLivePortfolioReturnValue } from "@/app/rebalancer/hooks";
import { SORTERS, TableData } from "@/app/rebalancer/components";
import { AccountTarget } from "@/server/actions";

export const Table: React.FC<{
  livePortfolio?: UseLivePortfolioReturnValue["data"];
  isLoading?: boolean;
  targets: AccountTarget[];
}> = ({ livePortfolio, isLoading, targets }) => {
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
        price: lineItem.price,
        distribution: lineItem.distribution,
        target: target?.percentage ?? 0,
        auction: lineItem.balance.auction,
      };
    });
    return formatted.sort((a, b) => sorter.sort(a, b, sortAscending));
  }, [livePortfolio, sorter, sortAscending, targets]);

  const totalValue = useMemo(() => {
    const total = tableData?.reduce((acc, holding) => {
      return acc + calcValue(holding);
    }, 0);
    return total ?? 0;
  }, [tableData]);

  return (
    <>
      <div className="grid min-w-[824px] grid-cols-[0.5fr_1.5fr_1.5fr_1.5fr_1.5fr_1.5fr]">
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
            {tableData.length === 0 && <EmptyRow />}
            {tableData.map((holding, index) => (
              <Fragment key={index}>
                <div className="flex flex-row items-center justify-start gap-2 border-b border-valence-black p-4">
                  <div
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{
                      backgroundColor: SymbolColors.get(holding.symbol),
                    }}
                  ></div>
                  <p className="text-sm font-bold">{holding.name}</p>
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

            {tableData.length !== 0 && <TotalValueRow total={totalValue} />}
          </>
        )}
      </div>
      {isLoading && <LoadingRows />}
    </>
  );
};

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
    <LoadingSkeleton className="min-h-12" />
    <LoadingSkeleton className="min-h-12" />
    <LoadingSkeleton className="min-h-12" />
  </div>
);
