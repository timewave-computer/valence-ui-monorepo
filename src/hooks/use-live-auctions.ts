"use client";

import { QUERY_KEYS } from "@/const/query-keys";
import { fetchLiveAuctions } from "@/server/actions";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useLiveAuctions = () => {
  return useSuspenseQuery({
    refetchOnMount: true,
    refetchInterval: 5 * 1000, // 5 seconds
    queryFn: () => fetchLiveAuctions(),
    queryKey: [QUERY_KEYS.LIVE_AUCTIONS],
    retry: (errorCount) => errorCount < 1,
  });
};
