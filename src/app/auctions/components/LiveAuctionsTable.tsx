"use client";
import {
  SortableTableHeader,
  Sorter,
  TextCell,
  LinkCell,
  StatusCell,
  StatusCellVariant,
  StatusCellProps,
} from "@/components";
import { displayAddress } from "@/utils";
import { compareStrings } from "@/utils/table-sorters";
import { Fragment, useState } from "react";

const headers: Array<{
  label: string;
  sorterKey: string;
  cell?: React.FC<any>;
}> = [
  {
    label: "Pair",
    sorterKey: "pair",
  },
  {
    label: "Current price",
    sorterKey: "currentPrice",
  },
  {
    label: "Start price",
    sorterKey: "endPrice",
  },
  {
    label: "End price",
    sorterKey: "endPrice",
  },
  {
    label: "Status",
    sorterKey: "status",
  },
  {
    label: "Amount remaining",
    sorterKey: "amountRemaining",
  },
  {
    label: "Initial amount",
    sorterKey: "initialAmount",
  },

  {
    label: "Start block",
    sorterKey: "startBlock",
  },
  {
    label: "End block",
    sorterKey: "endBlock",
  },
  {
    label: "Bids",
    sorterKey: "bids",
  },
  {
    label: "Address",
    sorterKey: "auctionAddress",
  },
];

const data = [
  {
    pair: "USDC/NTRN",
    currentPrice: "0.0001",
    startPrice: "0.000000000001",
    initialAmount: "0.0001",
    amountRemaining: "0.0001",
    status: "Active",
    endPrice: "0.0001",
    startBlock: "15188836",
    endBlock: "15188836",
    address:
      "neutron13exc5wdc7y5qpqazc34djnu934lqvfw2dru30j52ahhjep6jzx8ssjxcyz",
    initlaAmount: "0.0001",
    bids: "0",
  },
  {
    pair: "NTRN/USDC",
    currentPrice: "0.0002",
    startPrice: "0.0001",
    amountRemaining: "0.0001",
    initlaAmount: "0.000000000000001",
    status: "Finished",
    startBlock: "15188836",
    endBlock: "15188836",
    bids: "0",
    address:
      "neutron13exc5wdc7y5qpqazc34djnu934lqvfw2dru30j52ahhjep6jzx8ssjxcyz",
    endPrice: "0.0001",
  },
  {
    pair: "NTRN/USDC",
    currentPrice: "0.0002",
    startPrice: "0.0001",
    amountRemaining: "0.0001",
    initlaAmount: "0.000000000000001",
    status: "Closed",
    startBlock: "15188836",
    endBlock: "15188836",
    bids: "0",
    address:
      "neutron13exc5wdc7y5qpqazc34djnu934lqvfw2dru30j52ahhjep6jzx8ssjxcyz",
    endPrice: "0.0001",
  },
];

export function LiveAuctionsTable() {
  const [sorterKey, setSorter] = useState<string>(
    LIVE_AUCTION_SORTER_KEYS.PAIR,
  );
  const [sortAscending, setSortAscending] = useState(true);
  const sorter =
    LIVE_AUCTION_SORTERS.find((s) => s.key === sorterKey) ??
    LIVE_AUCTION_SORTERS[0];

  return (
    <div className="w-screen p-4 ">
      <div className=" w-full overflow-x-auto  ">
        <div className="h-6 w-full border border-valence-mediumgray bg-valence-mediumgray" />
        <div className=" grid w-full grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto_auto] overflow-x-auto border-x border-b border-valence-lightgray">
          {headers.map((header) => (
            <SortableTableHeader
              textClassName="font-semibold"
              buttonClassName="border-x border-y py-1 px-1 flex justify-center text-sm border border-valence-lightgray"
              key={`live-auction-header-cell-${header.sorterKey}`}
              label={header.label}
              sorterKey={header.sorterKey}
              currentSorter={sorter}
              ascending={sortAscending}
              setSorter={setSorter}
              setSortAscending={setSortAscending}
            />
          ))}
          {data.map((row) => {
            return (
              <Fragment key={"row-" + row.pair}>
                <TextCell>{row.pair}</TextCell>
                <TextCell>{row.currentPrice}</TextCell>
                <TextCell>{row.startPrice}</TextCell>
                <TextCell>{row.endPrice}</TextCell>
                <StatusCell
                  variant={
                    auctionStatusCellVariant[row.status as AuctionStatus]
                  }
                >
                  {row.status.toUpperCase()}
                </StatusCell>
                <TextCell>{row.amountRemaining}</TextCell>
                <TextCell>{row.initialAmount}</TextCell>
                <LinkCell href="sa">{row.startBlock}</LinkCell>
                <LinkCell href="sa">{row.endBlock}</LinkCell>
                <TextCell>{row.bids}</TextCell>
                <LinkCell href="sa">{displayAddress(row.address)}</LinkCell>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const LIVE_AUCTION_SORTER_KEYS = {
  PAIR: "pair",
};
type LiveAuctionTableData = {
  pair: string;
};
export const LIVE_AUCTION_SORTERS: Sorter<LiveAuctionTableData>[] = [
  {
    key: LIVE_AUCTION_SORTER_KEYS.PAIR,
    sort: (a, b, ascending) => compareStrings(a.pair, b.pair, ascending),
  },
];

export enum AuctionStatus {
  Active = "Active",
  Finished = "Finished",
  Closed = "Closed",
}

export const auctionStatusCellVariant: Record<
  AuctionStatus,
  StatusCellProps["variant"]
> = {
  [AuctionStatus.Active]: "green",
  [AuctionStatus.Finished]: "yellow",
  [AuctionStatus.Closed]: "gray",
};
