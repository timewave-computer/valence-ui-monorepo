import { TextCell } from "@/components";
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

  if (showOsmosis) {
    return (
      <TextCell isLoading={isLoading} className="gap-2">
        <div className="flex flex-col">
          <span className="text-[8px]">Astroport</span>
          {/* NOTE: using clsx instead of cn because twMerge overrwrites custom classes */}
          <span
            className={clsx(
              isFetching && "animate-pulse-fetching",
              "text-xxs",
              highlight && "text-valence-red",
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
      <TextCell isLoading={isLoading} className="gap-2 text-xs">
        <span
          className={clsx(
            isFetching && "animate-pulse-fetching",
            highlight && "text-valence-red",
          )}
        >
          {displayNumber}
        </span>
      </TextCell>
    );
};
