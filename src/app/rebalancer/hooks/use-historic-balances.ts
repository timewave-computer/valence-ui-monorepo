import { QUERY_KEYS } from "@/const/query-keys";
import { fetchHistoricalBalances } from "@/server/actions";
import { microToBase } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { usePrefetchData, useAssetCache } from "@/app/rebalancer/hooks";

export const useHistoricBalances = ({
  accountAddress,
  startDate,
  endDate,
}: {
  accountAddress: string;
  startDate: Date;
  endDate: Date;
}) => {
  const { isFetched } = usePrefetchData();
  const { getOriginAsset } = useAssetCache();

  return useQuery({
    enabled: isFetched && accountAddress.length > 0,
    retry: (errorCount) => {
      return errorCount < 1;
    },
    queryKey: [
      QUERY_KEYS.HISTORIC_BALANCES,
      accountAddress,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const data = await fetchHistoricalBalances(accountAddress, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      const convertedData = data.map((timeSeriesData) => {
        const balanceData = timeSeriesData.value;
        const convertedBalances = Object.keys(balanceData).map((denom) => {
          const asset = getOriginAsset(denom);
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
      return convertedData as Array<{
        timestamp: number;
        balances: Array<{ denom: string; amount: number }>;
      }>;
    },
  });
};
