import { useQuery } from "@tanstack/react-query";
import { AuctionTableData } from "@/app/auctions/components";
import { QUERY_KEYS } from "@/const";
import { fetchAstroportRoute } from "@/server/actions";
import { TextCell } from "@/components";
import { displayNumberV2 } from "@/utils";

export const BenchmarkCell = ({
  auctionData,
  pair,
}: {
  pair: [string, string];
  auctionData?: AuctionTableData["raw"];
}) => {
  const amount = Number(auctionData?.auction.available_amount) ?? 0;

  const astroportQuery = useQuery({
    enabled: amount > 0,
    queryKey: [QUERY_KEYS.ASTROPORT_PRICE, pair[0], pair[1]],
    refetchInterval: 5 * 1000, // 5 seconds
    queryFn: async () => {
      return fetchAstroportRoute(amount.toString(), {
        // order is switched, not sure why but this gives the right numbers
        fromDenom: pair[1],
        toDenom: pair[0],
      });
    },
  });

  if (amount === 0) return <TextCell>-</TextCell>;

  const displayNumber = astroportQuery.data
    ? displayNumberV2(astroportQuery.data)
    : "-";

  return (
    <TextCell isLoading={astroportQuery.isLoading} className="gap-2">
      <div className="flex flex-col">
        <span className="text-[8px]">Astroport</span>
        <span className="text-xxs"> {displayNumber}</span>
      </div>

      <div className="flex flex-col">
        <span className="text-[8px]">Osmosis</span>
        <span className="text-xxs">-</span>
      </div>
    </TextCell>
  );
};
