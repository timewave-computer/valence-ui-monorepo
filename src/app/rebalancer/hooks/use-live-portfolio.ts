import { QUERY_KEYS } from "@/const/query-keys";
import { fetchAccountBalances, fetchAuctionBalances } from "@/server/actions";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAssetCache, usePriceCache } from "./use-cached-data";
import { microToBase } from "@/utils";

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
export const useLivePortfolio = ({
  rebalancerAddress,
  targetDenoms,
}: {
  rebalancerAddress: string;
  targetDenoms: string[];
}): UseLivePortfolioReturnValue => {
  const isFetchEnabled =
    rebalancerAddress?.length > 0 && targetDenoms?.length > 0;
  const { getAsset } = useAssetCache();
  const { getPrice } = usePriceCache();

  const accountBalancesQuery = useQuery({
    staleTime: 60 * 1000, // every minute
    refetchInterval: 1000 * 60,
    enabled: isFetchEnabled,
    queryKey: [QUERY_KEYS.ACCOUNT_BALANCES, rebalancerAddress, targetDenoms],
    queryFn: async () => {
      const rawBalances = await fetchAccountBalances({
        address: rebalancerAddress,
        targetDenoms: targetDenoms,
      });

      // balances from stargate client returned in mico units
      return rawBalances.map((balance) => {
        const asset = getAsset(balance.denom);
        return {
          denom: balance.denom,
          amount: microToBase(balance.amount ?? 0, asset?.decimals ?? 6),
        };
      });
    },
  });
  const auctionBalancesQuery = useQuery({
    staleTime: 60 * 1000,
    queryKey: [QUERY_KEYS.AUCTION_BALANCES, rebalancerAddress],
    retry: (errorCount) => {
      if (errorCount > 1) {
        return false;
      }
      return true;
    },
    refetchInterval: 1000 * 60 * 5, //every 5 minutes
    queryFn: async () => {
      const response = await fetchAuctionBalances({
        address: rebalancerAddress,
      });
      return response.map((balance) => ({
        amount: parseFloat(balance.amount ?? 0),
        denom: balance.denom,
      }));
    },
    enabled: isFetchEnabled,
  });

  const formattedData = useMemo(() => {
    if (!targetDenoms) return [];

    return targetDenoms.map((denom) => {
      const accountBalance = accountBalancesQuery.data?.find(
        (balance) => balance.denom === denom,
      );
      const auctionBalance = auctionBalancesQuery.data?.find(
        (balance) => balance.denom === denom,
      );

      const price = getPrice(denom);
      const asset = getAsset(denom);

      return {
        balance: {
          total: accountBalance?.amount ?? 0 + (auctionBalance?.amount ?? 0),
          account: accountBalance?.amount ?? 0,
          auction: auctionBalance?.amount ?? 0,
        },
        denom,
        symbol: asset?.symbol ?? "",
        name: asset?.name ?? "",
        price: price ?? 0,
      };
    });
  }, [getAsset, accountBalancesQuery.data, getPrice, targetDenoms]);

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
    isLoading: accountBalancesQuery.isLoading || auctionBalancesQuery.isLoading,
    data: dataWithDistribution,
    totalValue,
    isError: accountBalancesQuery.isError || auctionBalancesQuery.isError,
  };
  // return each asset with asset data, price, distribution, total value
};
