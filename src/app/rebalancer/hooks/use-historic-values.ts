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
import {
  IndexerHistoricalTargetsResponse,
  IndexerOraclePricesResponse,
} from "@/types/rebalancer";
import { UTCDate } from "@date-fns/utc";
import { ErrorHandler } from "@/const/error";
import { USDC_DENOM } from "@/const/chain-data";
import { priceSourceAtom } from "@/app/rebalancer/globals";
import { useAtom } from "jotai";
import { cache } from "react";

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
    error: cacheError,
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
  const [priceSource] = useAtom(priceSourceAtom);

  const historicalValues = useQuery({
    queryKey: [
      QUERY_KEYS.COMBINED_HISTORICAL_VALUE_DATA,
      targets,
      accountAddress,
      priceSource,
    ],
    enabled: isCacheFetched && balanceQuery.isFetched && targetQuery.isFetched,
    queryFn: () => {
      const mergedData: FetchHistoricalValuesReturnValue["values"] = [];
      balanceQuery.data?.forEach((historicBalanceData) => {
        const ts = historicBalanceData.timestamp;
        const tokens: FetchHistoricalValuesReturnValue["values"][number]["tokens"] =
          [];
        targets.forEach((target) => {
          const balance = historicBalanceData.balances.find(
            (b) => b.denom === target.denom,
          );

          if (priceSource === "oracle") {
            const prices =
              queryClient.getQueryData<IndexerOraclePricesResponse>([
                QUERY_KEYS.HISTORIC_PRICES_ORACLE,
                target.denom,
              ]);
            if (target.denom === USDC_DENOM) {
              tokens.push({
                denom: target.denom,
                amount: balance?.amount ?? 0,
                price: 1,
              });
            } else {
              tokens.push({
                denom: target.denom,
                amount: balance?.amount ?? 0,
                price: findClosestOraclePrice(ts, prices ?? []),
              });
            }
          } else {
            const prices = queryClient.getQueryData<CoinGeckoHistoricPrices>([
              QUERY_KEYS.HISTORIC_PRICES_COINGECKO,
              target.denom,
            ]);
            tokens.push({
              denom: target.denom,
              amount: balance?.amount ?? 0,
              price: findClosestCoingeckoPrice(ts, prices ?? []),
            });
          }
        });
        mergedData.push({
          timestamp: ts,
          tokens,
          readableDate: new UTCDate(ts).toISOString(),
        });
      });
      return mergedData;
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
      cacheError,
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

// Helper function to find the price with the closest timestamp
function findClosestOraclePrice(
  balanceTimestamp: number,
  prices: IndexerOraclePricesResponse,
): number {
  if (prices.length === 0) {
    ErrorHandler.warn("No prices found for denom");
    return 0;
  }
  const sorted = prices.sort(
    (a, b) =>
      Math.abs(balanceTimestamp - Number(a.at)) - // prices are in form [timestamp, price]  [ 1714611745449, 1.0007257446162172 ],
      Math.abs(balanceTimestamp - Number(b.at)),
  );
  return Number(sorted[0].value?.price); // take first element, extract price
}
