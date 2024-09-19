"use client";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { fetchAuctionLimits } from "@/server/actions";

export const useAuctionLimits = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUCTION_LIMITS],
    queryFn: async () => {
      return await fetchAuctionLimits();
    },
  });
};
