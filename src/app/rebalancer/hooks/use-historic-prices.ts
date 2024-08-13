type HistoricPriceTimeSeriesData = { timestamp: number; [key: string]: number };

import { usePrefetchData } from "@/app/rebalancer/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { CoinGeckoHistoricPrices } from "@/types/coingecko";
import { chainConfig } from "@/const/config";

/***
 * Data is fetched for last 365 days by default
 * Based on the scale (W,M,Y), we filter data by minimum timestamp, generate x axis ticks, and massage data into format digestible by the graph
 * We generate projections with last historic price for a time period ahead
 *
 */

/***
 * NOT USED, would be nice, but there is some issue with closures.
 */
export const useHistoricPrices = () => {
  const { isFetched: isCacheFetched, isLoading: isCacheLoading } =
    usePrefetchData();
  const queryClient = useQueryClient();

  const pricesForDenoms = useQuery({
    queryKey: [QUERY_KEYS.COMBINED_HISTORIC_PRICES],
    enabled: isCacheFetched,
    staleTime: 1000 * 60 * 10,
    queryFn: function () {
      const resultsMap = new Map<number, HistoricPriceTimeSeriesData>();
      const denomsToFetchPrices = chainConfig.supportedAssets.map(
        (a) => a.denom,
      );
      denomsToFetchPrices.forEach((denom) => {
        const prices = queryClient.getQueryData<CoinGeckoHistoricPrices>([
          QUERY_KEYS.HISTORIC_PRICES,
          denom,
        ]);
        prices?.forEach(([timestamp, price]) => {
          if (!resultsMap.has(timestamp)) {
            resultsMap.set(timestamp, { timestamp });
          }
          const entry = resultsMap.get(timestamp);
          if (entry) {
            entry[denom] = price;
          }
        });
      });
      const resultsArray = Array.from(resultsMap.values());
      return resultsArray;
    },
  });

  return {
    isLoading: isCacheLoading || pricesForDenoms.isLoading,
    isFetched: isCacheFetched,
    data: pricesForDenoms.data,
    isError: pricesForDenoms.isError,
  };
};
