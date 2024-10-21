"use client";

import { QUERY_KEYS } from "@/const/query-keys";
import { fetchLiveAuctions } from "@/server/actions";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLiveAuctions = () => {
  return useSuspenseQuery({
    refetchInterval: 5 * 1000, // 5 seconds
    queryFn: async () => {
      return fetchLiveAuctions();
    },
    queryKey: [QUERY_KEYS.LIVE_AUCTIONS],
    retry: (errorCount) => errorCount < 1,
  });
};
