import { TableCell } from "@valence-ui/ui-components";
import { displayNumberV2, FeatureFlags, useFeatureFlag } from "@/utils";
import clsx from "clsx";

export const BenchmarkCell = ({
  isLoading,
  price,
  highlight,
  isFetching,
}: {
  highlight?: boolean;
  price: number | null;
  isLoading?: boolean; // initial load
  isFetching?: boolean; // refetching
}) => {
  const showOsmosis = useFeatureFlag(FeatureFlags.AUCTIONS_OSMOSIS_PRICE);
  const displayNumber = price ? displayNumberV2(price) : "-";

  return (
    <TableCell
      variant={"primary"}
      align={"center"}
      isLoading={isLoading}
      className="gap-2 text-xs"
    >
      <span
        className={clsx(
          isFetching && "animate-pulse-fetching",
          highlight && "text-valence-red",
        )}
      >
        {displayNumber}
      </span>
    </TableCell>
  );
};
