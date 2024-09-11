import {
  AccountTarget,
  FetchHistoricalValuesReturnValue,
} from "@/server/actions";
import { findClosestCoingeckoPrice, useDateRange } from "@/utils";

import {
  useHistoricBalances,
  useHistoricTargets,
  usePrefetchData,
} from "@/app/rebalancer/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { CoinGeckoHistoricPrices } from "@/types/coingecko";
import { IndexerHistoricalTargetsResponse } from "@/types/rebalancer";
import { UTCDate } from "@date-fns/utc";

export const useHistoricValues = ({
  accountAddress,
  targets,
}: {
  accountAddress: string;
  targets: Array<AccountTarget>;
}) => {
  const { startDate, endDate } = useDateRange();
  const {
    isFetched: isCacheFetched,
    isLoading: isCacheLoading,
    isError: isCacheError,
  } = usePrefetchData();
  const balanceQuery = useHistoricBalances({
    accountAddress,
    startDate,
    endDate,
  });
  const targetQuery = useHistoricTargets({
    accountAddress,
    startDate,
    endDate,
  });
  const queryClient = useQueryClient();

  const historicalValues = useQuery({
    queryKey: [
      QUERY_KEYS.COMBINED_HISTORICAL_VALUE_DATA,
      targets,
      accountAddress,
    ],
    enabled: isCacheFetched && balanceQuery.isFetched && targetQuery.isFetched,
    queryFn: () => {
      const tempMergedData: FetchHistoricalValuesReturnValue["values"] = [];
      balanceQuery.data?.forEach((historicBalanceData) => {
        const ts = historicBalanceData.timestamp;
        const tokens: FetchHistoricalValuesReturnValue["values"][number]["tokens"] =
          [];
        targets.forEach((target) => {
          const balance = historicBalanceData.balances.find(
            (b) => b.denom === target.denom,
          );
          const prices = queryClient.getQueryData<CoinGeckoHistoricPrices>([
            QUERY_KEYS.HISTORIC_PRICES,
            target.denom,
          ]);
          tokens.push({
            denom: target.denom,
            amount: balance?.amount ?? 0,
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
    isLoading:
      historicalValues.isLoading ||
      balanceQuery.isLoading ||
      targetQuery.isLoading ||
      isCacheLoading,
    isError:
      isCacheError ||
      balanceQuery.isError ||
      targetQuery.isError ||
      historicalValues.isError,
    error: [
      balanceQuery.error,
      targetQuery.error,
      historicalValues.error,
    ].toString(),
    data: historicalValues.data,
    historicTargets: targetQuery.data as IndexerHistoricalTargetsResponse,
  } as UseHistoricalValuesReturnValue;
};

export type UseHistoricalValuesReturnValue = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  data: {
    timestamp: number;
    readableDate: string;
    tokens: Array<{
      denom: string;
      price: number;
      amount: number;
    }>;
  }[];
  historicTargets: IndexerHistoricalTargetsResponse;
};
