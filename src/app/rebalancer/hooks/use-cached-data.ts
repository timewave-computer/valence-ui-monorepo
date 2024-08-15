"use client";
import { useCallback } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import {
  fetchHistoricalPricesV2,
  fetchOriginAssets,
  getPrices,
} from "@/server/actions";
import { QUERY_KEYS } from "@/const/query-keys";
import { chainConfig } from "@/const/config";
import { OriginAsset } from "@/types/ibc";
import { withTimeout } from "./use-historic-targets";

const getOriginAssetQueryArgs = (denom: string) => ({
  queryKey: [QUERY_KEYS.ORIGIN_ASSET, denom],
  refetchInterval: 0,
  staleTime: 1000 * 60 * 10, // 10 mins, really should never need it
  queryFn: async () => {
    const originAsset = await fetchOriginAssets([
      {
        denom: denom,
        chain_id: chainConfig.chain.chain_id,
      },
    ]);
    return originAsset[0].asset;
  },
});

const getPriceQueryArgs = (denom: string, coingeckoId: string) => ({
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  queryKey: [QUERY_KEYS.COINGECKO_PRICE, denom],
  staleTime: 1000 * 30, // 30s
  refetchInterval: 1000 * 30, // 30s
  queryFn: async () => {
    const price = await getPrices([coingeckoId]);
    return price[coingeckoId];
  },
});

export const useAssetCache = () => {
  const queryClient = useQueryClient();

  const fetchAsset = useCallback(
    (denom: string) => {
      return queryClient.ensureQueryData(getOriginAssetQueryArgs(denom));
    },
    [queryClient],
  );

  const getOriginAsset = useCallback(
    (denom: string) => {
      return queryClient.getQueryData<OriginAsset>([
        QUERY_KEYS.ORIGIN_ASSET,
        denom,
      ]);
    },
    [queryClient],
  );

  return {
    getOriginAsset,
    fetchAsset,
  };
};

export const usePriceCache = () => {
  const queryClient = useQueryClient();
  const getPrice = useCallback(
    (denom: string) => {
      return queryClient.getQueryData<number>([
        QUERY_KEYS.COINGECKO_PRICE,
        denom,
      ]);
    },
    [queryClient],
  );

  return {
    getPrice,
  };
};
export const usePrefetchData = () => {
  const originAssetQueries = useQueries({
    queries: chainConfig.supportedAssets.map((asset) =>
      getOriginAssetQueryArgs(asset.denom),
    ),
  });
  const livePriceQueries = useQueries({
    queries: chainConfig.supportedAssets.map((asset) =>
      getPriceQueryArgs(asset.denom, asset.coingeckoId),
    ),
  });

  const historicPriceQueries = useQueries({
    queries: chainConfig.supportedAssets.map((asset) => ({
      staleTime: 60 * 1000 * 10, // 10 mins
      queryKey: [QUERY_KEYS.HISTORIC_PRICES, asset.denom],
      refetchInterval: 0,
      retry: (errorCount: number) => errorCount < 1,
      queryFn: () =>
        withTimeout(async () => {
          return fetchHistoricalPricesV2({
            denom: asset.denom,
            coingeckoId: asset.coingeckoId,
          });
        }, QUERY_KEYS.HISTORIC_PRICES),
    })),
  });

  return {
    isError:
      originAssetQueries.some((q) => q.isError) ||
      livePriceQueries.some((q) => q.isError) ||
      historicPriceQueries.some((q) => q.isError),
    isLoading:
      originAssetQueries.some((q) => q.isLoading) ||
      livePriceQueries.some((q) => q.isLoading) ||
      historicPriceQueries.some((q) => q.isLoading),
    isFetched:
      originAssetQueries.every((q) => q.isFetched) &&
      livePriceQueries.every((q) => q.isFetched) &&
      historicPriceQueries.every((q) => q.isFetched),
  };
};
