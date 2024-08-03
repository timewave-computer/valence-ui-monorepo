"use client";
import { useCallback } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchOriginAssets, getPrices } from "@/server/actions";
import { QUERY_KEYS } from "@/const/query-keys";
import { chainConfig } from "@/const/config";
import { OriginAsset } from "@/types/ibc";

const getOriginAssetQueryArgs = (denom: string) => ({
  queryKey: [QUERY_KEYS.ORIGIN_ASSET, denom],
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

  const getAsset = useCallback(
    (denom: string) => {
      return queryClient.getQueryData<OriginAsset>([
        QUERY_KEYS.ORIGIN_ASSET,
        denom,
      ]);
    },
    [queryClient],
  );

  return {
    getAsset,
    fetchAsset,
  };
};

export const usePriceCache = () => {
  const queryClient = useQueryClient();

  const getPrice = useCallback(
    (denom: string) => {
      // should be cached

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
export const usePrefetchAssets = () => {
  const queryClient = useQueryClient();

  const prefetchAssetQueries = useQueries({
    queries: chainConfig.supportedAssets.map((asset) =>
      getOriginAssetQueryArgs(asset.denom),
    ),
  });

  const isAssetsPrefetched = prefetchAssetQueries.every((q) => q.isFetched);

  const prefetchPriceQueries = useQueries({
    queries: chainConfig.supportedAssets.map((asset) => {
      const cachedAsset = queryClient.getQueryData<OriginAsset>([
        QUERY_KEYS.ORIGIN_ASSET,
        asset.denom,
      ]);
      return {
        ...getPriceQueryArgs(asset.denom, cachedAsset?.coingecko_id ?? ""),
        queryKey: [QUERY_KEYS.COINGECKO_PRICE, asset.denom],
        enabled: isAssetsPrefetched,
        queryFn: async () => {
          const cachedAsset = await queryClient.ensureQueryData(
            getOriginAssetQueryArgs(asset.denom),
          );

          if (!cachedAsset) {
            // fetch asset (but should be cached)
            console.error(asset.denom + " not found in cache");
            return 0;
          }
          if (!cachedAsset.coingecko_id) {
            // fetch asset (but should be cached)
            console.error(asset.denom + "price not cached");
            return 0;
          }
          const price = await getPrices([cachedAsset.coingecko_id]);
          return price[cachedAsset.coingecko_id];
        },
      };
    }),
  });

  const isLoading =
    prefetchPriceQueries.some((q) => q.isLoading) ||
    prefetchAssetQueries.some((q) => q.isLoading);

  return {
    isLoading,
  };
};
