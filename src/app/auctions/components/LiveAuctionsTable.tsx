"use client";
import { useAssetMetadata } from "@/app/rebalancer/hooks";
import {
  SortableTableHeader,
  Sorter,
  TextCell,
  StatusCell,
  StatusCellProps,
} from "@/components";
import {
  AuctionStatus,
  CelatoneUrl,
  chainConfig,
  LiveAuctionStatus,
  QUERY_KEYS,
} from "@/const";
import {
  fetchLiveAuctions,
  FetchLiveAuctionsReturnType,
} from "@/server/actions";
import {
  displayAddress,
  displayNumberV2,
  displayLocalTimezone,
  displayUtcToLocal,
  getBlockDate,
  microToBase,
  useFeatureFlag,
  FeatureFlags,
  cn,
} from "@/utils";
import { compareNumbers, compareStrings } from "@/utils/table-sorters";
import { Fragment, useEffect, useMemo, useState, use } from "react";
import { BenchmarkCell } from "@/app/auctions/components";
import { useQuery } from "@tanstack/react-query";

export function LiveAuctionsTable({
  initialAuctionsData,
}: {
  initialAuctionsData: FetchLiveAuctionsReturnType;
}) {
  const { data: auctionsData, isFetching: isAuctionsDataFetching } = useQuery({
    initialData: initialAuctionsData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 1000, // 5 seconds
    queryFn: async () => {
      return fetchLiveAuctions();
    },
    queryKey: [QUERY_KEYS.LIVE_AUCTIONS],
    retry: (errorCount) => errorCount < 1,
  });
  const [sorterKey, setSorter] = useState<string>(
    LIVE_AUCTION_TABLE_SORTER_KEYS.PAIR,
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

  const tableData: AuctionTableData[] = !auctionsData?.auctions
    ? []
    : auctionsData?.auctions
        .map((row) => {
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
              )?.price;
              price = livePrice ?? null;
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
            raw: row,
            pair: pairString,
            priceRaw: price,
            price: displayPrice,
            startPrice: displayNumberV2(parseFloat(row.auction.start_price)),
            endPrice: displayNumberV2(parseFloat(row.auction.end_price)),
            decreasePerBlock: displayNumberV2(
              getPriceDecreasePerBlock({
                startPrice: parseFloat(row.auction.start_price),
                endPrice: parseFloat(row.auction.end_price),
                startBlock: row.auction.start_block,
                endBlock: row.auction.end_block,
              }),
            ),
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
        })
        .sort((a, b) => sorter.sort(a, b, sortAscending));

  const now = new Date();
  const [localStartDate, setLocalStartDate] = useState<Date>(now);
  const [localEndDate, setLocalEndDate] = useState<Date>(now);
  useEffect(() => {
    // ensures time is local time and and server time
    setLocalStartDate(new Date(startTime));
    setLocalEndDate(new Date(endTime));
  }, [startTime, endTime]);

  const timeDisplayString = `${displayUtcToLocal(localStartDate)} ${localStartDate.toLocaleDateString()} -  ${displayUtcToLocal(localEndDate)} ${localEndDate.toLocaleDateString()} ${displayLocalTimezone(localStartDate)}`;

  const showOsmosisPrice = useFeatureFlag(FeatureFlags.AUCTIONS_OSMOSIS_PRICE);
  const headers = liveAuctionsTableHeaders(showOsmosisPrice);

  return (
    <>
      <h1 className="text-xl font-bold">Live Auctions</h1>
      <div className="font-mono text-xs font-light">
        <p className="text-center" suppressHydrationWarning>
          {timeDisplayString}
        </p>
      </div>
      <div className="w-full max-w-[1600px] pt-4">
        <div className="border border-valence-mediumgray bg-valence-mediumgray px-1.5 py-1">
          <p className="text-xs font-semibold text-valence-black">
            Current block:{" "}
            <span
              className={cn(isAuctionsDataFetching && "animate-pulse-fetching")}
            >
              {auctionsData?.currentBlock}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto_auto_auto] overflow-x-auto border-x border-b border-valence-lightgray">
          {headers.map((header) => (
            <SortableTableHeader
              textClassName="font-semibold"
              buttonClassName="border-x border-y py-1 px-1.5 flex justify-center text-sm border border-valence-lightgray"
              key={`live-auction-header-cell-${header.sorterKey}`}
              label={header.label}
              sorterKey={header.sorterKey ?? ""}
              currentSorter={sorter}
              ascending={sortAscending}
              setSorter={setSorter}
              setSortAscending={setSortAscending}
            />
          ))}
          {tableData.map((row) => {
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
                    {!isClosed && (
                      <span>
                        {" "}
                        {row.buyAsset.symbol}/{row.sellAsset.symbol}
                      </span>
                    )}
                  </span>
                  {isFinished && (
                    <span className="self-start text-xxs font-light">*</span>
                  )}
                </TextCell>
                <BenchmarkCell
                  price={row.priceRaw}
                  auctionData={row.raw}
                  pair={row.raw.pair}
                />
                <TextCell>{isClosed ? "-" : row.startPrice}</TextCell>
                <TextCell>{isClosed ? "-" : row.endPrice}</TextCell>
                <TextCell>{isClosed ? "-" : row.decreasePerBlock}</TextCell>
                <StatusCell variant={auctionStatusCellVariant[row.status]}>
                  {row.status.toUpperCase()}
                </StatusCell>
                <TextCell>{isClosed ? "-" : row.amountRemaining}</TextCell>
                <TextCell>{isClosed ? "-" : row.initialAmount}</TextCell>
                <TextCell href={CelatoneUrl.block(row.startBlock)}>
                  {row.startBlock.toString()}
                </TextCell>
                <TextCell>{row.endBlock.toString()}</TextCell>
                <TextCell href={CelatoneUrl.contract(row.auctionAddress)}>
                  {displayAddress(row.auctionAddress)}
                </TextCell>
              </Fragment>
            );
          })}
        </div>
      </div>

      <p className="font-mono text-xs font-light">* = Settled price</p>
    </>
  );
}

const getPriceDecreasePerBlock = ({
  startBlock,
  endBlock,
  endPrice,
  startPrice,
}: {
  startPrice: number;
  endPrice: number;
  startBlock: number;
  endBlock: number;
}) => {
  return (startPrice - endPrice) / (endBlock - startBlock);
};

enum LIVE_AUCTION_TABLE_SORTER_KEYS {
  PAIR = "pair",
  DECREASE = "decrease",
  PRICE = "price",
  START_PRICE = "startPrice",
  END_PRICE = "endPrice",
  STATUS = "status",
  AMOUNT_REMAINING = "amountRemaining",
  INITIAL_AMOUNT = "initialAmount",
  START_BLOCK = "startBlock",
  END_BLOCK = "endBlock",
  AUCTION_ADDRESS = "auctionAddress",
}

type LiveAuctionTableSorterKey = `${LIVE_AUCTION_TABLE_SORTER_KEYS}`;

const liveAuctionsTableHeaders = (
  showOsmosisPrice: boolean,
): Array<{
  label: string;
  sorterKey?: string;
  cell?: React.FC<any>;
}> => {
  return [
    {
      label: "Pair",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.PAIR,
    },
    {
      label: "Price",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.PRICE,
    },
    ...(showOsmosisPrice
      ? [
          {
            label: "Live Benchmark",
          },
        ]
      : [
          {
            label: "Live Astroport Price",
          },
        ]),

    {
      label: "Start price",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.START_PRICE,
    },
    {
      label: "End price",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.END_PRICE,
    },
    {
      label: "Decrease per block",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.DECREASE,
    },
    {
      label: "Status",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.STATUS,
    },
    {
      label: "Amount remaining",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.AMOUNT_REMAINING,
    },
    {
      label: "Initial amount",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.INITIAL_AMOUNT,
    },

    {
      label: "Start block",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.START_BLOCK,
    },
    {
      label: "End block",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.END_BLOCK,
    },
    {
      label: "Address",
      sorterKey: LIVE_AUCTION_TABLE_SORTER_KEYS.AUCTION_ADDRESS,
    },
  ];
};

export const LIVE_AUCTION_SORTERS: Sorter<
  AuctionTableData,
  LiveAuctionTableSorterKey
>[] = [
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.PAIR,
    sort: (a, b, ascending) => compareStrings(a.pair, b.pair, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.PRICE,
    sort: (a, b, ascending) => compareNumbers(a.price, b.price, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.START_PRICE,
    sort: (a, b, ascending) =>
      compareNumbers(a.startPrice, b.startPrice, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.END_PRICE,
    sort: (a, b, ascending) =>
      compareNumbers(a.endPrice, b.endPrice, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.INITIAL_AMOUNT,
    sort: (a, b, ascending) =>
      compareNumbers(a.initialAmount, b.initialAmount, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.AMOUNT_REMAINING,
    sort: (a, b, ascending) =>
      compareNumbers(a.amountRemaining, b.amountRemaining, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.START_BLOCK,
    sort: (a, b, ascending) =>
      compareNumbers(a.startBlock, b.startBlock, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.END_BLOCK,
    sort: (a, b, ascending) =>
      compareNumbers(a.endBlock, b.endBlock, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.AUCTION_ADDRESS,
    sort: (a, b, ascending) =>
      compareNumbers(a.auctionAddress, b.auctionAddress, ascending),
  },
  {
    key: LIVE_AUCTION_TABLE_SORTER_KEYS.DECREASE,
    sort: (a, b, ascending) =>
      compareNumbers(a.decreasePerBlock, b.decreasePerBlock, ascending),
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

export type AuctionTableData = {
  raw: FetchLiveAuctionsReturnType["auctions"][0];
  priceRaw: number | null;
  pair: string;
  price: string;
  startPrice: string;
  endPrice: string;
  decreasePerBlock: string;
  status: AuctionStatus;
  amountRemaining: string;
  initialAmount: string;
  startBlock: number;
  endBlock: number;
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
