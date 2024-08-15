import { QUERY_KEYS } from "@/const/query-keys";
import { fetchHistoricalBalances } from "@/server/actions";
import { microToBase } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import {
  usePrefetchData,
  useAssetCache,
  withTimeout,
} from "@/app/rebalancer/hooks";

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
  const { getOriginAsset } = useAssetCache();

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
    queryFn: () =>
      withTimeout(
        async () => {
          const data = await fetchHistoricalBalances(rebalancerAddress, {
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
        QUERY_KEYS.HISTORIC_BALANCES,
        10000,
      ) as Promise<
        Array<{
          timestamp: number;
          balances: Array<{ denom: string; amount: number }>;
        }>
      >,
  });
};
