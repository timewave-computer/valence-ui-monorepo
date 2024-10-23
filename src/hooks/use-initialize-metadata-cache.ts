import { chainConfig, QUERY_KEYS } from "@/const";
import { fetchOriginAssets } from "@/server/actions";
import { OriginAsset } from "@/types/ibc";
import { useQueries } from "@tanstack/react-query";

// hook can be instantated at root client level and used via useCache
export const useInitializeMetadataCache = (initialData: InitialMetadata) => {
  return useQueries({
    queries: Object.keys(initialData).map((denom) => {
      return {
        refetchInterval: 0,
        queryKey: [QUERY_KEYS.ORIGIN_ASSET, denom],
        initialData: initialData[denom],
        queryFn: async () => {
          const originAsset = await fetchOriginAssets([
            {
              denom: denom,
              chain_id: chainConfig.chain.chain_id,
            },
          ]);
          return originAsset[0].asset;
        },
      };
    }),
  });
};

export type InitialMetadata = Record<string, OriginAsset>;
