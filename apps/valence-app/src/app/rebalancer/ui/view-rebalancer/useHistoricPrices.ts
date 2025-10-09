"use client";
import { chainConfig } from "@/const/config";
import { QUERY_KEYS } from "@/const/query-keys";
import { fetchHistoricalPricesV2 } from "@/server/actions";
import { fetchOraclePrices } from "@/server/actions/fetch-oracle-prices";
import { useQueries } from "@tanstack/react-query";

// TODO: lazy load oracle prices. they are not even used in production.
export const useHistoricPrices = () => {
  const historicCoingeckoPriceQueries = useQueries({
    queries: chainConfig.supportedRebalancerAssets.map((asset) => ({
      staleTime: 60 * 1000 * 10, // 10 mins
      queryKey: [QUERY_KEYS.HISTORIC_PRICES_COINGECKO, asset.denom],
      refetchInterval: 0,
      retry: false,
      queryFn: async () => {
        const data = await fetchHistoricalPricesV2({
          denom: asset.denom,
          coingeckoId: asset.coingeckoId,
        });
        return data;
      },
    })),
  });
  const historicOraclePriceQueries = useQueries({
    queries: chainConfig.supportedRebalancerAssets.map((asset) => ({
      staleTime: 60 * 1000 * 10, // 10 mins
      queryKey: [QUERY_KEYS.HISTORIC_PRICES_ORACLE, asset.denom],
      refetchInterval: 0,
      retry: false,
      queryFn: () => fetchOraclePrices(asset.denom),
    })),
  });
  return {
    state: {
      isError:
        historicOraclePriceQueries.some((q) => q.isError) ||
        historicCoingeckoPriceQueries.some((q) => q.isError),
      error:
        historicOraclePriceQueries.find((q) => q.isError)?.error ||
        historicCoingeckoPriceQueries.find((q) => q.isError)?.error,
      isLoading:
        historicOraclePriceQueries.some((q) => q.isLoading) ||
        historicCoingeckoPriceQueries.some((q) => q.isLoading),
      isFetched:
        historicOraclePriceQueries.every((q) => q.isFetched) &&
        historicCoingeckoPriceQueries.every((q) => q.isFetched),
    },
  };
};
