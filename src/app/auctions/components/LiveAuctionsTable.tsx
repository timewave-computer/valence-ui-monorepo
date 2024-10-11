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
import {
  AuctionStatus,
  CelatoneUrl,
  chainConfig,
  LiveAuctionStatus,
} from "@/const";
import { useLiveAuctions } from "@/hooks/use-live-auctions";
import {
  cn,
  displayAddress,
  displayNumberV2,
  displayUtcToLocal,
  getBlockDate,
  microToBase,
} from "@/utils";
import { compareNumbers, compareStrings } from "@/utils/table-sorters";
import { Fragment, useEffect, useMemo, useState } from "react";

export function LiveAuctionsTable({}: {}) {
  const { data: auctionsData, isFetching: isAuctionsDataFetching } =
    useLiveAuctions();
  const [sorterKey, setSorter] = useState<string>(
    LIVE_AUCTION_SORTER_KEYS.PAIR,
  );
  const [sortAscending, setSortAscending] = useState(false);
  const sorter =
    LIVE_AUCTION_SORTERS.find((s) => s.key === sorterKey) ??
    LIVE_AUCTION_SORTERS[0];

  const { getOriginAsset } = useAssetMetadata();

  const { startTime, endTime } = useMemo(() => {
    return {
      startTime: getBlockDate({
        estimatedBlockTime: chainConfig.estBlockTime,
        blockNumber: auctionsData?.auctions[0]?.auction.start_block,
        currentBlockNumber: auctionsData?.currentBlock,
      }),
      endTime: getBlockDate({
        estimatedBlockTime: chainConfig.estBlockTime,
        blockNumber: auctionsData?.auctions[0]?.auction.end_block,
        currentBlockNumber: auctionsData?.currentBlock,
      }),
    };
    // purposefully not including currentBlock in the deps array, to keep it from changing too often
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auctionsData?.auctions]);

  const unsortedTableData: AuctionTableData[] = useMemo(() => {
    if (!auctionsData?.auctions) return [];

    return auctionsData?.auctions.map((row) => {
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

      let price: number | null = null;

      switch (row.auction.status) {
        case LiveAuctionStatus.Active:
          const livePrice = auctionsData.prices.find(
            (a) => a?.address === row.address,
          );
          price = livePrice?.price ?? null;
          break;
        case LiveAuctionStatus.Finished:
          const resolvedAmount = microToBase(
            parseFloat(row.auction.resolved_amount),
            buyAsset?.decimals ?? 6,
          );
          price = resolvedAmount / initialAmount;
          break;
        case LiveAuctionStatus.Closed:
          break;
      }

      const displayPrice = price ? displayNumberV2(price) : "-";

      return {
        pair: pairString,
        price: displayPrice,
        startPrice: displayNumberV2(parseFloat(row.auction.start_price)),
        endPrice: displayNumberV2(parseFloat(row.auction.end_price)),
        status: row.auction.status,
        amountRemaining: displayNumberV2(amountRemaining, {
          maximumFractionDigits: 6,
          minimumFractionDigits: 6,
        }),
        initialAmount: displayNumberV2(initialAmount, {
          maximumFractionDigits: 6,
          minimumFractionDigits: 6,
        }),
        startBlock: row.auction.start_block,
        endBlock: row.auction.end_block,
        // bids: "TODO",
        auctionAddress: row.address,
        buyAsset: {
          symbol: buyAsset?.symbol ?? "",
          denom: buyAsset?.denom ?? "",
        },
        sellAsset: {
          symbol: sellAsset?.symbol ?? "",
          denom: sellAsset?.denom ?? "",
        },
      };
    });
  }, [auctionsData?.auctions]);

  const sortedTableData = useMemo(() => {
    return unsortedTableData.sort((a, b) => sorter.sort(a, b, sortAscending));
  }, [sorterKey, sortAscending, unsortedTableData]);

  const now = new Date();
  const [localStartDate, setLocalStartDate] = useState<Date>(now);
  const [localEndDate, setLocalEndDate] = useState<Date>(now);
  useEffect(() => {
    // ensures time is local time and and server time
    setLocalStartDate(new Date(startTime));
    setLocalEndDate(new Date(endTime));
  }, [startTime, endTime]);

  const timeDisplayString = `${localStartDate.toLocaleDateString()} ${displayUtcToLocal(localStartDate, { excludeTz: true })} - ${localEndDate.toLocaleDateString()} ${displayUtcToLocal(localEndDate)} (est.)`;

  return (
    <>
      <h1 className="text-xl font-bold">Auction Cycle [todo]</h1>
      <div className="font-mono text-xs font-light">
        <p className="text-center" suppressHydrationWarning>
          {timeDisplayString}
        </p>
      </div>
      <div className="w-full max-w-[1600px] pt-4">
        <div className="border border-valence-mediumgray bg-valence-mediumgray px-1.5 py-1">
          <p className="text-sm font-semibold text-valence-black">
            Current block:{" "}
            <span
              className={cn(isAuctionsDataFetching && "animate-pulse-fetching")}
            >
              {auctionsData?.currentBlock}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto] overflow-x-auto border-x border-b border-valence-lightgray">
          {liveAuctionsTableHeaders.map((header) => (
            <SortableTableHeader
              textClassName="font-semibold"
              buttonClassName="border-x border-y py-1 px-1.5 flex justify-center text-sm border border-valence-lightgray"
              key={`live-auction-header-cell-${header.sorterKey}`}
              label={header.label}
              sorterKey={header.sorterKey}
              currentSorter={sorter}
              ascending={sortAscending}
              setSorter={setSorter}
              setSortAscending={setSortAscending}
            />
          ))}
          {sortedTableData.map((row) => {
            const isClosed = row.status === LiveAuctionStatus.Closed;
            const isActive = row.status === LiveAuctionStatus.Active;
            const isFinished = row.status === LiveAuctionStatus.Finished;
            return (
              <Fragment key={"row-" + row.pair}>
                <TextCell>{row.pair}</TextCell>
                <TextCell className="flex items-center">
                  <span
                    className={cn(
                      isAuctionsDataFetching &&
                        isActive &&
                        "animate-pulse-fetching",
                    )}
                  >
                    {row.price}
                    <span>
                      {" "}
                      {row.buyAsset.symbol}/{row.sellAsset.symbol}
                    </span>
                  </span>
                  {isFinished && (
                    <span className="self-start text-xxs font-light">*</span>
                  )}
                </TextCell>
                <TextCell>{isClosed ? "-" : row.startPrice}</TextCell>
                <TextCell>{isClosed ? "-" : row.endPrice}</TextCell>
                <StatusCell variant={auctionStatusCellVariant[row.status]}>
                  {row.status.toUpperCase()}
                </StatusCell>
                <TextCell>
                  <span
                    className={cn(
                      isAuctionsDataFetching &&
                        isActive &&
                        " animate-pulse-fetching",
                    )}
                  >
                    {isClosed ? "-" : row.amountRemaining}
                  </span>
                </TextCell>
                <TextCell>{isClosed ? "-" : row.initialAmount}</TextCell>
                <LinkCell href={CelatoneUrl.block(row.startBlock)}>
                  {row.startBlock.toString()}
                </LinkCell>
                <LinkCell href={CelatoneUrl.block(row.endBlock)}>
                  {row.endBlock.toString()}
                </LinkCell>
                <LinkCell href={CelatoneUrl.contract(row.auctionAddress)}>
                  {displayAddress(row.auctionAddress)}
                </LinkCell>
              </Fragment>
            );
          })}
        </div>
      </div>

      <p className="font-mono text-xs font-light">* = Settled price</p>
    </>
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
    label: "Price",
    sorterKey: "price",
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
    label: "Address",
    sorterKey: "auctionAddress",
  },
];

const LIVE_AUCTION_SORTER_KEYS = {
  PAIR: "pair",
  PRICE: "price",
  START_PRICE: "startPrice",
  END_PRICE: "endPrice",
  STATUS: "status",
  AMOUNT_REMAINING: "amountRemaining",
  INITIAL_AMOUNT: "initialAmount",
  START_BLOCK: "startBlock",
  END_BLOCK: "endBlock",
  AUCTION_ADDRESS: "auctionAddress",
};

export const LIVE_AUCTION_SORTERS: Sorter<AuctionTableData>[] = [
  {
    key: LIVE_AUCTION_SORTER_KEYS.PAIR,
    sort: (a, b, ascending) => compareStrings(a.pair, b.pair, ascending),
  },
  {
    key: LIVE_AUCTION_SORTER_KEYS.PRICE,
    sort: (a, b, ascending) => compareNumbers(a.price, b.price, ascending),
  },
  {
    key: LIVE_AUCTION_SORTER_KEYS.START_PRICE,
    sort: (a, b, ascending) =>
      compareNumbers(a.startPrice, b.startPrice, ascending),
  },
  {
    key: LIVE_AUCTION_SORTER_KEYS.END_PRICE,
    sort: (a, b, ascending) =>
      compareNumbers(a.endPrice, b.endPrice, ascending),
  },
  {
    key: LIVE_AUCTION_SORTER_KEYS.INITIAL_AMOUNT,
    sort: (a, b, ascending) =>
      compareNumbers(a.initialAmount, b.initialAmount, ascending),
  },
  {
    key: LIVE_AUCTION_SORTER_KEYS.AMOUNT_REMAINING,
    sort: (a, b, ascending) =>
      compareNumbers(a.amountRemaining, b.amountRemaining, ascending),
  },
  {
    key: LIVE_AUCTION_SORTER_KEYS.START_BLOCK,
    sort: (a, b, ascending) =>
      compareNumbers(a.startBlock, b.startBlock, ascending),
  },
  {
    key: LIVE_AUCTION_SORTER_KEYS.END_BLOCK,
    sort: (a, b, ascending) =>
      compareNumbers(a.endBlock, b.endBlock, ascending),
  },
  {
    key: LIVE_AUCTION_SORTER_KEYS.AUCTION_ADDRESS,
    sort: (a, b, ascending) =>
      compareNumbers(a.auctionAddress, b.auctionAddress, ascending),
  },
];

const auctionStatusCellVariant: Record<
  LiveAuctionStatus,
  StatusCellProps["variant"]
> = {
  [LiveAuctionStatus.Active]: "green",
  [LiveAuctionStatus.Finished]: "yellow",
  [LiveAuctionStatus.Closed]: "gray",
};

type AuctionTableData = {
  pair: string;
  price: string;
  startPrice: string;
  endPrice: string;
  status: AuctionStatus;
  amountRemaining: string;
  initialAmount: string;
  startBlock: number;
  endBlock: number;
  // bids: number;
  auctionAddress: string;
  buyAsset: {
    symbol: string;
    denom: string;
  };
  sellAsset: {
    symbol: string;
    denom: string;
  };
};
