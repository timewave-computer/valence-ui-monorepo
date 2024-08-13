import { QUERY_KEYS } from "@/const/query-keys";
import { fetchAccountBalances, fetchAuctionBalances } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  useAssetCache,
  usePrefetchData,
  usePriceCache,
} from "@/app/rebalancer/hooks";
import { microToBase } from "@/utils";
import { ErrorHandler } from "@/const/error";

export type UseLivePortfolioReturnValue = {
  isLoading: boolean;
  data: Array<{
    balance: {
      total: number;
      account: number;
      auction: number;
    };
    denom: string;
    symbol: string;
    name: string;
    price: number;
    distribution: number;
  }>;
  totalValue: number;
  isError: boolean;
};

type BalanceReturnValue = { denom: string; amount: number }[];
export const useLivePortfolio = ({
  rebalancerAddress,
  targetDenoms,
}: {
  rebalancerAddress: string;
  targetDenoms: string[];
}): UseLivePortfolioReturnValue => {
  const { isFetched: isCacheFetched } = usePrefetchData();
  const isFetchEnabled =
    isCacheFetched && !!rebalancerAddress?.length && targetDenoms?.length > 0;

  const { getAsset } = useAssetCache();
  const { getPrice } = usePriceCache();

  const accountBalancesQuery = useQuery({
    refetchInterval: 1000 * 60,
    enabled: isFetchEnabled,
    retry: (errorCount) => {
      return errorCount < 2;
    },
    queryKey: [
      QUERY_KEYS.ACCOUNT_BALANCES,
      rebalancerAddress,
      targetDenoms,
      isCacheFetched,
    ],
    queryFn: (): Promise<BalanceReturnValue> => {
      return new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Request timed out"));
        }, 5000);

        try {
          const rawBalances = await fetchAccountBalances({
            address: rebalancerAddress,
            targetDenoms: targetDenoms,
          });
          clearTimeout(timeout);
          // balances from stargate client returned in micro units
          const processedBalances = rawBalances.map((balance) => {
            const asset = getAsset(balance.denom);
            return {
              denom: balance.denom,
              amount: microToBase(balance.amount ?? 0, asset?.decimals ?? 6),
            };
          });
          resolve(processedBalances);
        } catch (error) {
          clearTimeout(timeout);
          throw ErrorHandler.makeError("Request timed out", error);
        }
      });
    },
  });

  // raw because it needs to be converted from micro units. done below to simplify error handling
  const rawAuctionBalancesQuery = useQuery({
    refetchInterval: 60 * 1000 * 5,
    enabled: isFetchEnabled,
    retry: (errorCount) => {
      return errorCount < 2;
    },
    queryKey: [QUERY_KEYS.AUCTION_BALANCES, rebalancerAddress, isCacheFetched],

    queryFn: async (): Promise<BalanceReturnValue> => {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Request timed out"));
        }, 5000);

        fetchAuctionBalances({
          address: rebalancerAddress,
        })
          .then((response) => {
            clearTimeout(timeout);
            resolve(
              response.map((balance) => ({
                amount: parseFloat(balance.amount ?? 0),
                denom: balance.denom,
              })),
            );
          })
          .catch((error) => {
            clearTimeout(timeout);
            throw ErrorHandler.makeError("Request timed out", error);
          });
      });
    },
  });

  const formattedData = useMemo(() => {
    if (!targetDenoms || !isCacheFetched) return [];

    return targetDenoms.map((denom) => {
      const accountBalance = accountBalancesQuery.data?.find(
        (balance) => balance.denom === denom,
      );
      const rawAuctionBalance = rawAuctionBalancesQuery.data?.find(
        (balance) => balance.denom === denom,
      );

      const price = getPrice(denom);
      const asset = getAsset(denom);

      if (!asset || !price) throw ErrorHandler.makeError("data not cached");

      const auctionAmount = microToBase(
        rawAuctionBalance?.amount ?? 0,
        asset.decimals,
      );
      return {
        balance: {
          total: (accountBalance?.amount ?? 0) + auctionAmount,
          account: accountBalance?.amount ?? 0,
          auction: auctionAmount,
        },
        denom,
        symbol: asset.symbol,
        name: asset.name,
        price: price,
      };
    });
  }, [
    isCacheFetched,
    getAsset,
    rawAuctionBalancesQuery.data,
    accountBalancesQuery.data,
    getPrice,
    targetDenoms,
  ]);

  const totalValue = formattedData.reduce((acc, holding) => {
    return acc + holding.balance.total * holding.price;
  }, 0);

  const dataWithDistribution = formattedData.map((holding) => {
    return {
      ...holding,
      distribution: (holding.balance.total * holding.price) / totalValue,
    };
  });

  return {
    isLoading:
      accountBalancesQuery.isLoading || rawAuctionBalancesQuery.isLoading,
    data: dataWithDistribution,
    totalValue,
    isError: accountBalancesQuery.isError || rawAuctionBalancesQuery.isError,
  };
  // return each asset with asset data, price, distribution, total value
};
