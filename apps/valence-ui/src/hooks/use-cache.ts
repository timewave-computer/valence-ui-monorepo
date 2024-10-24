import { QUERY_KEYS } from "@/const";
import { OriginAsset } from "@/types/ibc";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useCache = () => {
  const queryClient = useQueryClient();

  const getAssetMetadata = useCallback(
    (denom: string) => {
      const result = queryClient.getQueryData<OriginAsset>([
        QUERY_KEYS.ORIGIN_ASSET,
        denom,
      ]);
      if (!result) throw new Error("Asset not in cache");
      return result;
    },
    [queryClient],
  );

  return {
    getAssetMetadata,
  };
};
