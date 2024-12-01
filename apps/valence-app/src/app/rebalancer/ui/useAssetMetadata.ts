"use client";
import { useCallback } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchOriginAssets } from "@/server/actions";
import { QUERY_KEYS } from "@/const/query-keys";
import { chainConfig } from "@/const/config";
import { OriginAsset } from "@/types/ibc";

export const useAssetMetadata = () => {
  const queryClient = useQueryClient();

  // data is prefetched
  const getOriginAsset = useCallback(
    (denom: string) => {
      return queryClient.getQueryData<OriginAsset>([
        QUERY_KEYS.ORIGIN_ASSET,
        denom,
      ]);
    },
    [queryClient],
  );

  const queryState = useQueries({
    queries: chainConfig.supportedRebalancerAssets.map((asset) => {
      return {
        queryKey: [QUERY_KEYS.ORIGIN_ASSET, asset.denom],
        queryFn: async () => {
          const originAsset = await fetchOriginAssets([
            {
              denom: asset.denom,
              chain_id: chainConfig.chain.chain_id,
            },
          ]);
          return originAsset[0].asset;
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

  // const fetchAsset = useCallback(
  //   (denom: string) => {
  //     return queryClient.ensureQueryData(getOriginAssetQueryArgs(denom));
  //   },
  //   [queryClient],
  // );

  return {
    getOriginAsset,
    state: queryState,
  };
};
