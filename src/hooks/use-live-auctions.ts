"use client";

import { QUERY_KEYS } from "@/const/query-keys";
import { fetchLiveAuctions } from "@/server/actions";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLiveAuctions = () => {
  return useSuspenseQuery({
    refetchInterval: 30 * 1000, // 30 seconds
    queryFn: () => fetchLiveAuctions(),
    queryKey: [QUERY_KEYS.LIVE_AUCTIONS],
    retry: (errorCount) => errorCount < 1,
  });
};
