"use client";
import { useCallback } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { getPrices } from "@/server/actions";
import { QUERY_KEYS } from "@/const/query-keys";
import { chainConfig } from "@/const/config";

export const useLivePrices = () => {
  const queryClient = useQueryClient();
  // data is prefetched

  const getPrice = useCallback(
    (denom: string) => {
      return queryClient.getQueryData<number>([
        QUERY_KEYS.COINGECKO_PRICE,
        denom,
      ]);
    },
    [queryClient],
  );

  const queryState = useQueries({
    queries: chainConfig.supportedAssets.map((asset) => {
      return {
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [QUERY_KEYS.COINGECKO_PRICE, asset.denom],
        refetchOnMount: false,
        refetchInterval: 1000 * 30,
        queryFn: async () => {
          const price = await getPrices([asset.coingeckoId]);
          return price[asset.coingeckoId];
        },
      };
    }),
    combine: (results) => {
      return {
        isError: results.some((result) => result.isError),
        isLoading: results.some((result) => result.isPending),
        error: results.find((result) => result.isError)?.error,
        isFetched: results.every((result) => result.isFetched),
      };
    },
  });

  return {
    getPrice,
    state: queryState,
  };
};
