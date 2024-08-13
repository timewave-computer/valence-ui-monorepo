import { QUERY_KEYS } from "@/const/query-keys";
import { fetchHistoricalBalances } from "@/server/actions";
import { microToBase } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { usePrefetchData, useAssetCache } from "@/app/rebalancer/hooks";

export const useHistoricBalances = ({
  rebalancerAddress,
  startDate,
  endDate,
}: {
  rebalancerAddress: string;
  startDate: Date;
  endDate: Date;
}) => {
  const { isFetched } = usePrefetchData();
  const { getAsset } = useAssetCache();

  return useQuery({
    enabled: isFetched && rebalancerAddress.length > 0,
    retry: (errorCount) => {
      return errorCount < 1;
    },
    queryKey: [
      QUERY_KEYS.HISTORIC_BALANCES,
      rebalancerAddress,
      startDate,
      endDate,
    ],
    queryFn: async () => {
      const data = await fetchHistoricalBalances(rebalancerAddress, {
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
