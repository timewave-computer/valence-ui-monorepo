import { QUERY_KEYS } from "@/const/query-keys";
import { fetchHistoricalBalances } from "@/server/actions";
import { microToBase } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { usePrefetchData, useAssetCache } from "./use-cached-data";

export const useHistoricBalances = ({
  address,
  startDate,
  endDate,
}: {
  address: string;
  startDate: Date;
  endDate: Date;
}) => {
  const { isFetched } = usePrefetchData();
  const { getAsset } = useAssetCache();

  return useQuery({
    staleTime: 1000 * 60 * 10, // 10 mins,
    refetchInterval: 0,
    enabled: isFetched && address.length > 0,
    retry: (errorCount) => {
      return errorCount < 1;
    },
    queryKey: [QUERY_KEYS.HISTORIC_BALANCES, address, startDate, endDate],
    queryFn: async () => {
      const data = await fetchHistoricalBalances(address, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      return data.map((timeSeriesData) => {
        const balanceData = timeSeriesData.value;
        const convertedBalances = Object.keys(balanceData).map((denom) => {
          const asset = getAsset(denom);
          const amount = balanceData[denom];
          return {
            denom: denom,
            amount: microToBase(amount ?? 0, asset?.decimals ?? 6),
          };
        });
        return {
          timestamp: Number(timeSeriesData.at),
          balances: convertedBalances,
        };
      });
    },
  });
};
