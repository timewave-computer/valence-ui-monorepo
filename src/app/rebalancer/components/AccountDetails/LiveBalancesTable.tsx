"use client";
import {
  SortableTableHeader,
  Sorter,
  LoadingSkeleton,
  IconTooltipContent,
} from "@/components";
import {
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { cn, displayNumber } from "@/utils";
import {
  useAccountConfigQuery,
  useLivePortfolio,
} from "@/app/rebalancer/hooks";
import { useAtom } from "jotai";
import { accountAtom } from "@/app/rebalancer/globals";
import { LivePortfolioTooltipCopy } from "@/app/rebalancer/const";
import { Asset } from "@/app/rebalancer/components";

export type TableData = {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  distribution: number;
  target: number;
  auction: number;
  amountWithdrawable: number;
};

export const LiveBalancesTable: React.FC<{}> = ({}) => {
  const [sorterKey, setSorter] = useState<string>(SORTER_KEYS.VALUE);
  const [sortAscending, setSortAscending] = useState(true);
  const sorter = SORTERS.find((s) => s.key === sorterKey) ?? SORTERS[0];
  const [selectedAddress] = useAtom(accountAtom);

  const { data: config, isLoading: isConfigLoading } = useAccountConfigQuery({
    account: selectedAddress,
  });
  const { data: livePortfolio, isLoading: isBalancesLoading } =
    useLivePortfolio({
      accountAddress: selectedAddress,
    });

  const unsortedTableData: TableData[] = useMemo(() => {
    if (!livePortfolio?.balances || !config?.targets) return [];
    return livePortfolio?.balances
      .reduce((acc, lineItem) => {
        const target = config?.targets.find((t) => t.denom === lineItem.denom);
        if (target) {
          acc.push({
            symbol: lineItem.symbol,
            name: lineItem.name,
            amount: lineItem.balance.total,
            amountWithdrawable: lineItem.balance.account,
            auction: lineItem.balance.auction,
            price: lineItem.price,
            distribution: lineItem.distribution,
            target: target.percentage,
          });
        }
        return acc;
      }, [] as TableData[])
      .sort((a, b) => sorter.sort(a, b, sortAscending));
  }, [livePortfolio?.balances, sorter, sortAscending, config?.targets]);

  const tableData = useMemo(() => {
    return unsortedTableData.sort((a, b) => sorter.sort(a, b, sortAscending));
  }, [sorter, sortAscending, unsortedTableData]);

  const totalValue = useMemo(() => {
    const total = tableData?.reduce((acc, holding) => {
      return acc + calcValue(holding);
    }, 0);
    return total ?? 0;
  }, [tableData]);

  const isLoading = isBalancesLoading || isConfigLoading;

  if (isLoading) {
    return (
      <LiveBalancesTableLayout
        sorter={sorter}
        sortAscending={sortAscending}
        setSortAscending={setSortAscending}
        setSorter={setSorter}
      >
        <LoadingRows />
      </LiveBalancesTableLayout>
    );
  } else if (tableData.length === 0) {
    return (
      <LiveBalancesTableLayout
        sorter={sorter}
        sortAscending={sortAscending}
        setSortAscending={setSortAscending}
        setSorter={setSorter}
      >
        <EmptyRow />{" "}
      </LiveBalancesTableLayout>
    );
  } else
    return (
      <LiveBalancesTableLayout
        sorter={sorter}
        sortAscending={sortAscending}
        setSortAscending={setSortAscending}
        setSorter={setSorter}
      >
        {tableData.map((holding, index) => {
          return (
            <Fragment key={index}>
              <div
                className={cn(
                  index === 0 && "border-b border-t",
                  "flex flex-row items-center justify-start gap-2 border-b border-valence-mediumgray px-0 py-4",
                )}
              >
                <Asset asChild symbol={holding.symbol} />
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
                {displayNumber(holding.amountWithdrawable, { precision: 2 })}
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

        <TotalValueRow total={totalValue} />
      </LiveBalancesTableLayout>
    );
};

const LiveBalancesTableLayout: React.FC<{
  children: ReactNode;
  sorter: Sorter<TableData>;
  setSorter: Dispatch<SetStateAction<string>>;
  sortAscending: boolean;
  setSortAscending: Dispatch<SetStateAction<boolean>>;
}> = ({ children, sortAscending, sorter, setSorter, setSortAscending }) => {
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
          label="Amount Withdrawable"
          sorterKey={SORTER_KEYS.WITHDRAWABLE}
          currentSorter={sorter}
          ascending={sortAscending}
          setSorter={setSorter}
          setSortAscending={setSortAscending}
          buttonClassName="pt-0 justify-end px-0  border-y-0"
          textClassName=" text-xs font-base text-wrap "
          hoverTooltip={
            <IconTooltipContent {...LivePortfolioTooltipCopy.withdrawable} />
          }
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
        {children}
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
  WITHDRAWABLE = "withdrawable",
  DISTRIBUTION = "distribution",
  TARGET = "target",
}

export const SORTERS: Sorter<TableData>[] = [
  {
    key: SORTER_KEYS.TICKER,
    sort: (a, b, ascending) => compareStrings(a.symbol, b.symbol, ascending),
  },
  {
    key: SORTER_KEYS.WITHDRAWABLE,
    sort: (a, b, ascending) =>
      compareNumbers(a.amountWithdrawable, b.amountWithdrawable, ascending),
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

    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray px-0 text-right font-mono text-sm">
      {"0%"}
    </p>
    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray px-0 pr-0 text-right font-mono text-sm">
      {"0%"}
    </p>
    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray px-0 text-right font-mono text-sm">
      {"0.00"}
    </p>
    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray px-0 text-right font-mono text-sm">
      {"0.00"}
    </p>

    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray px-0 text-right font-mono text-sm">
      {"$0.00"}
    </p>

    <p className="flex flex-row items-center justify-end border-t border-valence-mediumgray px-0 text-right font-mono text-sm">
      {"$0.00"}
    </p>
  </>
);

const TotalValueRow: React.FC<{ total: number }> = ({ total }) => (
  <>
    <p className=" flex flex-row items-center border-valence-mediumgray px-0 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center border-valence-mediumgray px-0 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center border-valence-mediumgray px-0 text-right font-mono text-sm"></p>
    <p className="flex flex-row items-center border-valence-mediumgray px-0 text-right font-mono text-sm"></p>

    <p className="flex flex-row items-center border-valence-mediumgray px-4 text-right font-mono text-sm"></p>
    <p className="flex flex-row items-center  justify-end border-valence-mediumgray px-0 py-0 text-xs font-bold">
      Total Value
    </p>
    <p className="flex flex-row items-center justify-end  border-valence-mediumgray px-0 py-4 text-right font-mono text-xs font-bold">
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
