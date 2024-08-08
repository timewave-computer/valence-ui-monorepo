import {
  AccountTarget,
  FetchHistoricalValuesReturnValue,
} from "@/server/actions";
import { findClosestCoingeckoPrice } from "@/utils";
import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";
import {
  useHistoricBalances,
  useHistoricTargets,
  usePrefetchData,
} from "@/app/rebalancer/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { CoinGeckoHistoricPrices } from "@/types/coingecko";

export const useHistoricValues = ({
  address,
  targets,
}: {
  address: string;
  targets: Array<AccountTarget>;
}) => {
  const midnightUTC = new UTCDate(new UTCDate().setHours(0, 0, 0, 0));
  const startDate = subDays(midnightUTC, 365);
  const endDate = midnightUTC;

  const {
    isFetched: isCacheFetched,
    isLoading: isCacheLoading,
    isError: isCacheError,
  } = usePrefetchData();
  const balanceQuery = useHistoricBalances({ address, startDate, endDate });
  const targetQuery = useHistoricTargets({ address, startDate, endDate });
  const queryClient = useQueryClient();

  const historicalValues = useQuery({
    queryKey: [QUERY_KEYS.COMBINED_HISTORICAL_VALUE_DATA, targets, address],
    staleTime: Infinity,
    refetchInterval: 0,
    enabled: isCacheFetched && balanceQuery.isFetched && targetQuery.isFetched,
    queryFn: () => {
      const tempMergedData: FetchHistoricalValuesReturnValue["values"] = [];
      balanceQuery.data?.forEach((historicBalanceData) => {
        const ts = historicBalanceData.timestamp;
        const tokens: FetchHistoricalValuesReturnValue["values"][number]["tokens"] =
          [];
        historicBalanceData.balances.forEach((balance) => {
          const prices = queryClient.getQueryData<CoinGeckoHistoricPrices>([
            QUERY_KEYS.HISTORIC_PRICES,
            balance.denom,
          ]);

          tokens.push({
            denom: balance.denom,
            amount: balance.amount,
            price: findClosestCoingeckoPrice(ts, prices ?? []),
          });
        });

        tempMergedData.push({
          timestamp: ts,
          tokens,
          readableDate: new UTCDate(ts).toISOString(),
        });
      });
      return tempMergedData;
    },
  });

  return {
    isLoading: historicalValues.isLoading || isCacheLoading,
    isError:
      isCacheError ||
      balanceQuery.isError ||
      targetQuery.isError ||
      historicalValues.isError,
    data: historicalValues.data,
    historicTargets: targetQuery.data,
  };
};
