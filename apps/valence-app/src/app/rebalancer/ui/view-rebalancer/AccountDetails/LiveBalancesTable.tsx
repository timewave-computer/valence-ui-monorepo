"use client";
import {
  HoverContent,
  TableHeader,
  Table,
  TableColumnHeader,
  CellType,
  TableRow,
  TableCell,
} from "@valence-ui/ui-components";
import { useMemo } from "react";
import { displayNumber } from "@/utils";
import {
  useAccountConfigQuery,
  useLivePortfolio,
  SymbolColors,
} from "@/app/rebalancer/ui";
import { useAtom } from "jotai";
import { useQueryState } from "nuqs";

export type LiveBalancesTableData = {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  distribution: number;
  target: number;
  auction: number;
  amountWithdrawable: number;
};
const LivePortfolioTooltipCopy = {
  withdrawable: {
    title: "Amount withdrawable",
    text: `During each 24 hour cycle, a portion of funds are escrowed in auctions to be rebalanced that day. At the end of the cycle, when the auctions complete, funds are returned back to the account. At any given moment, the funds that a user can withdraw are their total holdings minus the funds escrowed for that auction cycle.`,
  },
};

export const LiveBalancesTable: React.FC<{}> = ({}) => {
  const [selectedAddress] = useQueryState("account", {
    defaultValue: "",
  });

  const { data: config, isLoading: isConfigLoading } = useAccountConfigQuery({
    account: selectedAddress,
  });
  const { data: livePortfolio, isLoading: isBalancesLoading } =
    useLivePortfolio({
      accountAddress: selectedAddress,
    });

  const data = livePortfolio?.balances?.reduce((acc, lineItem) => {
    const target = config?.targets.find((t) => t.denom === lineItem.denom);

    if (target) {
      const value = calcValue({
        amount: lineItem.balance.total,
        price: lineItem.price,
      });
      acc.push({
        ticker: {
          symbol: lineItem.symbol,
          color: SymbolColors.get(lineItem.symbol),
        },
        distribution: {
          value:
            displayNumber(lineItem.distribution * 100, {
              precision: 2,
            }) + "%",
        },
        target: {
          value:
            displayNumber(target?.percentage * 100, {
              precision: 2,
            }) + "%",
        },
        amountWithdrawable: {
          value: displayNumber(lineItem.balance.account, { precision: 2 }),
        },
        totalHoldings: {
          value: displayNumber(lineItem.balance.total, { precision: 2 }),
        },
        price: {
          isUsd: true,
          value: displayNumber(lineItem.price, { precision: 2 }),
        },
        usdValue: {
          isUsd: true,
          value: displayNumber(value, { precision: 2 }),
        },
      });
    }
    return acc;
  }, [] as Array<TableRow>);

  const totalValue = useMemo(() => {
    const total = livePortfolio.balances?.reduce((acc, holding) => {
      return (
        acc +
        calcValue({
          amount: holding.balance.total,
          price: holding.price,
        })
      );
    }, 0);
    return total ?? 0;
  }, [data]);

  const isLoading = isBalancesLoading || isConfigLoading;

  return (
    <Table
      variant="secondary"
      headers={headers}
      isLoading={isLoading}
      data={data}
    >
      {[...Array(headers.length - 2)].map((_, i) => (
        <TableCell key={`empty-total-row-${i}`} variant={"secondary"} />
      ))}

      <TableHeader label="Total value" align="right" variant="secondary" />

      <TableHeader
        label={`$${displayNumber(totalValue, { precision: 2 })}`}
        align="right"
        variant="secondary"
      />
    </Table>
  );
};

function calcValue({ amount, price }: { amount: number; price: number }) {
  return amount * price;
}

const headers: TableColumnHeader[] = [
  {
    key: "ticker",
    label: "Ticker",
    cellType: CellType.Asset,
    align: "left",
  },
  {
    key: "distribution",
    label: "Distribution",
    cellType: CellType.Number,
    align: "right",
  },
  {
    key: "target",
    label: "Target",
    cellType: CellType.Number,
    align: "right",
  },
  {
    key: "amountWithdrawable",
    label: "Amount Withdrawable",
    cellType: CellType.Number,
    align: "right",
    hoverTooltip: (
      <HoverContent
        className="max-w-md"
        {...LivePortfolioTooltipCopy.withdrawable}
      />
    ),
  },
  {
    key: "totalHoldings",
    label: "Total Holdings",
    cellType: CellType.Number,
    align: "right",
  },
  {
    key: "price",
    label: "Price",
    cellType: CellType.Number,
    align: "right",
  },
  {
    key: "usdValue",
    label: "USD Value",
    cellType: CellType.Number,
    align: "right",
  },
];
