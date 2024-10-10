"use client";
import { useAssetMetadata } from "@/app/rebalancer/hooks";
import {
  SortableTableHeader,
  Sorter,
  TextCell,
  LinkCell,
  StatusCell,
  StatusCellProps,
} from "@/components";
import { CelatoneUrl } from "@/const/celatone";
import { useLiveAuctions } from "@/hooks/use-live-auctions";
import { LiveAuctionStatus } from "@/server/actions";
import { displayAddress, displayNumberV2, microToBase } from "@/utils";
import { compareStrings } from "@/utils/table-sorters";
import { Fragment, useState } from "react";

export function LiveAuctionsTable({}: {}) {
  const { data: auctionsData } = useLiveAuctions();
  const [sorterKey, setSorter] = useState<string>(
    LIVE_AUCTION_SORTER_KEYS.PAIR,
  );
  const [sortAscending, setSortAscending] = useState(true);
  const sorter =
    LIVE_AUCTION_SORTERS.find((s) => s.key === sorterKey) ??
    LIVE_AUCTION_SORTERS[0];

  const { getOriginAsset } = useAssetMetadata();

  return (
    <div className="w-full max-w-[1600px] p-4">
      <span className="font-mono text-xs font-light">
        Current block: {auctionsData?.currentBlock}
      </span>
      <div className="h-6 border border-valence-mediumgray bg-valence-mediumgray" />
      <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto_auto] overflow-x-auto border-x border-b border-valence-lightgray">
        {liveAuctionsTableHeaders.map((header) => (
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
        {auctionsData?.auctions?.map((row) => {
          const [sellDenom, buyDenom] = row.pair;

          const sellAsset = getOriginAsset(sellDenom);
          const buyAsset = getOriginAsset(buyDenom);

          const pairString = `${sellAsset?.symbol}/${buyAsset?.symbol}`;

          const initialAmount = microToBase(
            row.auction.total_amount,
            sellAsset?.decimals ?? 6,
          );

          const amountRemaining = microToBase(
            row.auction.available_amount,
            sellAsset?.decimals ?? 6,
          );

          const isClosed = row.auction.status === AuctionStatus.Closed;
          const price = auctionsData.prices.find(
            (a) => a?.address === row.address,
          )?.price;

          const displayPrice = price
            ? displayNumberV2(price, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "-";

          return (
            <Fragment key={"row-" + row.pair}>
              <TextCell>{pairString}</TextCell>
              <TextCell>{displayPrice}</TextCell>
              <TextCell>
                {isClosed
                  ? "-"
                  : displayNumberV2(parseFloat(row.auction.start_price), {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </TextCell>
              <TextCell>
                {isClosed
                  ? "-"
                  : displayNumberV2(parseFloat(row.auction.end_price), {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </TextCell>
              <StatusCell
                variant={auctionStatusCellVariant[row.auction.status]}
              >
                {row.auction.status.toUpperCase()}
              </StatusCell>
              <TextCell>
                {isClosed
                  ? "-"
                  : displayNumberV2(amountRemaining, {
                      minimumFractionDigits: 2,
                    })}
              </TextCell>
              <TextCell>
                {isClosed
                  ? "-"
                  : displayNumberV2(initialAmount, {
                      minimumFractionDigits: 2,
                    })}
              </TextCell>
              <LinkCell href={CelatoneUrl.block(row.auction.start_block)}>
                {row.auction.start_block.toString()}
              </LinkCell>
              <LinkCell href={CelatoneUrl.block(row.auction.end_block)}>
                {row.auction.end_block.toString()}
              </LinkCell>
              <TextCell>{isClosed ? "-" : "TODO # bids"}</TextCell>
              <LinkCell href={CelatoneUrl.contract(row.address)}>
                {displayAddress(row.address)}
              </LinkCell>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

const liveAuctionsTableHeaders: Array<{
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
    sorterKey: "startPrice",
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
  Active = "started",
  Finished = "finished",
  Closed = "closed",
}

export const auctionStatusCellVariant: Record<
  LiveAuctionStatus,
  StatusCellProps["variant"]
> = {
  [AuctionStatus.Active]: "green",
  [AuctionStatus.Finished]: "yellow",
  [AuctionStatus.Closed]: "gray",
};
