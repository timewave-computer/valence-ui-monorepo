import { useQuery } from "@tanstack/react-query";
import { AuctionTableData } from "@/app/auctions/components";
import { LiveAuctionStatus, QUERY_KEYS } from "@/const";
import { fetchAstroportRate } from "@/server/actions";
import { TextCell } from "@/components";
import { displayNumberV2, FeatureFlags, useFeatureFlag } from "@/utils";
import clsx from "clsx";

export const BenchmarkCell = ({
  auctionData,
  pair,
  price,
}: {
  price: number | null;
  pair: [string, string];
  auctionData?: AuctionTableData["raw"];
}) => {
  let amount = 0;
  switch (auctionData?.auction?.status) {
    case LiveAuctionStatus.Active:
      amount = auctionData?.auction?.available_amount
        ? parseFloat(auctionData?.auction?.available_amount)
        : 0;
      break;
    case LiveAuctionStatus.Finished:
      amount = auctionData?.auction?.total_amount
        ? parseFloat(auctionData?.auction?.total_amount)
        : 0;
      break;
  }

  const astroportQuery = useQuery({
    enabled: amount > 0,
    queryKey: [
      QUERY_KEYS.ASTROPORT_PRICE,
      {
        fromDenom: pair[1],
        toDenom: pair[0],
      },
    ],
    retry: false,
    refetchInterval: 60 * 1000, // 1 minute
    queryFn: async () => {
      return fetchAstroportRate(amount.toString(), {
        // order is switched, not sure why but this gives the right numbers
        fromDenom: pair[1],
        toDenom: pair[0],
      });
    },
  });

  const showOsmosis = useFeatureFlag(FeatureFlags.AUCTIONS_OSMOSIS_PRICE);

  if (amount === 0 || astroportQuery?.isError) return <TextCell>-</TextCell>;

  const displayNumber = astroportQuery.data
    ? displayNumberV2(astroportQuery.data)
    : "-";

  const isAstroportPriceHigher =
    astroportQuery.data && price && astroportQuery.data > price;

  /***
   * For now, we only show 1 benchmark so return modified cell
   */

  if (showOsmosis) {
    return (
      <TextCell isLoading={astroportQuery.isLoading} className="gap-2">
        <div className="flex flex-col">
          <span className="text-[8px]">Astroport</span>
          {/* NOTE: using clsx instead of cn because twMerge overrwrites custom classes */}
          <span
            className={clsx(
              "text-xxs",
              isAstroportPriceHigher && "text-valence-red",
            )}
          >
            {" "}
            {displayNumber}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[8px]">Osmosis</span>
          <span className="text-xxs">-</span>
        </div>
      </TextCell>
    );
  } else
    return (
      <TextCell isLoading={astroportQuery.isLoading} className="gap-2 text-xs">
        <span
          className={clsx(
            isAstroportPriceHigher &&
              auctionData?.auction?.status === "active" &&
              "text-valence-red",
          )}
        >
          {displayNumber}
        </span>
      </TextCell>
    );
};
