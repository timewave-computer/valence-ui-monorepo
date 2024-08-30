import { QUERY_KEYS } from "@/const/query-keys";
import { fetchAccountBalances, fetchAuctionBalances } from "@/server/actions";
import { useQueries } from "@tanstack/react-query";
import {
  useAssetCache,
  usePrefetchData,
  usePriceCache,
} from "@/app/rebalancer/hooks";
import { microToBase } from "@/utils";
import { ErrorHandler } from "@/const/error";
import { chainConfig } from "@/const/config";

export type UseLivePortfolioReturnValue = {
  isLoading: boolean;
  data: { balances: Array<PortfolioLineItem>; totalValue: number };
  isError: boolean;
  isFetched: boolean;
};

type PortfolioLineItem = {
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
};

export type BalanceReturnValue = { denom: string; amount: number }[];
export const useLivePortfolio = ({
  accountAddress,
}: {
  accountAddress: string;
}): UseLivePortfolioReturnValue => {
  const { isFetched: isCacheFetched } = usePrefetchData();
  const isFetchEnabled = isCacheFetched && !!accountAddress?.length;

  const { getOriginAsset } = useAssetCache();
  const { getPrice } = usePriceCache();

  return useQueries({
    queries: [
      {
        refetchInterval: 1000 * 30,
        enabled: isFetchEnabled,
        retry: (errorCount) => {
          return errorCount < 2;
        },
        queryKey: [QUERY_KEYS.ACCOUNT_BALANCES, accountAddress],
        queryFn: (): Promise<BalanceReturnValue> => {
          return new Promise(async (resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Request timed out"));
            }, 5000);

            try {
              const rawBalances = await fetchAccountBalances({
                address: accountAddress,
              });
              clearTimeout(timeout);
              // balances from stargate client returned in micro units
              const processedBalances = rawBalances.map((balance) => {
                const asset = getOriginAsset(balance.denom);
                return {
                  denom: balance.denom,
                  amount: microToBase(
                    balance.amount ?? 0,
                    asset?.decimals ?? 6,
                  ),
                };
              });
              resolve(processedBalances);
            } catch (error) {
              clearTimeout(timeout);
              throw ErrorHandler.makeError("Request timed out", error);
            }
          });
        },
      },
      {
        refetchInterval: 60 * 1000 * 5,
        enabled: isFetchEnabled,
        retry: (errorCount) => {
          return errorCount < 2;
        },
        queryKey: [QUERY_KEYS.AUCTION_BALANCES, accountAddress],
        queryFn: async (): Promise<BalanceReturnValue> => {
          return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Request timed out"));
            }, 5000);

            fetchAuctionBalances({
              address: accountAddress,
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
      },
    ],
    combine: (results) => {
      let combinedData: Array<PortfolioLineItem> = [];
      let totalValue = 0;
      if (results[0]?.data && results[1]?.data) {
        const accountBalances = results[0].data;
        const rawAuctionBalances = results[1].data;

        const formattedData = chainConfig.supportedAssets.map(
          (supportedAsset) => {
            const denom = supportedAsset.denom;

            const accountBalance = accountBalances?.find(
              (balance) => balance?.denom === denom,
            );
            const rawAuctionBalance = rawAuctionBalances?.find(
              (balance) => balance?.denom === denom,
            );

            const price = getPrice(denom);
            const asset = getOriginAsset(denom);

            if (!asset || !price)
              throw ErrorHandler.makeError("data not cached");

            const auctionAmount = microToBase(
              rawAuctionBalance?.amount ?? 0,
              asset.decimals,
            );
            const totalAmount = (accountBalance?.amount ?? 0) + auctionAmount;
            return {
              balance: {
                total: totalAmount,
                account: accountBalance?.amount ?? 0,
                auction: auctionAmount,
              },
              denom,
              symbol: asset.symbol,
              name: asset.name,
              price: price,
            };
          },
        );

        const totalValue = formattedData.reduce((acc, holding) => {
          return acc + holding.balance.total * holding.price;
        }, 0);

        const dataWithDistribution = formattedData.map((holding) => {
          return {
            ...holding,
            distribution: (holding.balance.total * holding.price) / totalValue,
          };
        });
        combinedData = dataWithDistribution;
      }
      return {
        isLoading: results.every((result) => result.isLoading),
        data: { totalValue, balances: [...combinedData] },
        isError: results.some((result) => result.isError),
        isFetched: results.every((result) => result.isFetched),
      };
    },
  });
};
