import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  fetchHistoricalBalances,
  fetchHistoricalPricesV2,
  fetchHistoricalTargets,
  fetchOriginAssets,
  fetchRebalancerAccountConfiguration,
  getPrices,
} from "@/server/actions";
import { chainConfig } from "@/const/config";
import { withTimeout } from "@/app/rebalancer/hooks";
import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";
import { OriginAsset } from "@/types/ibc";
import { microToBase } from "@/utils";

const getOriginAssetQueryArgs = (denom: string) => ({
  queryKey: [QUERY_KEYS.ORIGIN_ASSET, denom],
  queryFn: async () => {
    const originAsset = await fetchOriginAssets([
      {
        denom: denom,
        chain_id: chainConfig.chain.chain_id,
      },
    ]);
    return originAsset[0].asset;
  },
});

const getPriceQueryArgs = (denom: string, coingeckoId: string) => ({
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  queryKey: [QUERY_KEYS.COINGECKO_PRICE, denom],
  refetchInterval: 1000 * 60 * 5, // 5 minutes
  queryFn: async () => {
    const price = await getPrices([coingeckoId]);
    return price[coingeckoId];
  },
});

// fetch assets and prices
export const prefetchMetadata = async (queryClient: QueryClient) => {
  const prefetchAssetRequests = chainConfig.supportedAssets.map((asset) => {
    return queryClient.prefetchQuery(getOriginAssetQueryArgs(asset.denom));
  });

  const prefetchPrices = chainConfig.supportedAssets.map((asset) => {
    return queryClient.prefetchQuery(
      getPriceQueryArgs(asset.denom, asset.coingeckoId),
    );
  });
  await Promise.all([...prefetchAssetRequests, ...prefetchPrices]);
};

// fetch historical prices, and if account fetch balances and targets
export const prefetchHistoricalData = async (
  queryClient: QueryClient,
  account?: string,
) => {
  const prefetchedHistoricPrices = chainConfig.supportedAssets.map((asset) => {
    return queryClient.prefetchQuery({
      staleTime: 60 * 1000 * 10, // 10 mins
      queryKey: [QUERY_KEYS.HISTORIC_PRICES, asset.denom],
      retry: (errorCount: number) => errorCount < 1,
      queryFn: () =>
        withTimeout(async () => {
          return fetchHistoricalPricesV2({
            denom: asset.denom,
            coingeckoId: asset.coingeckoId,
          });
        }, QUERY_KEYS.HISTORIC_PRICES),
    });
  });

  Promise.all(prefetchedHistoricPrices);

  if (account && account.length > 0) {
    await prefetchHistoricalDataForAccount(account, queryClient);
  }
};

export const prefetchHistoricalDataForAccount = async (
  accountAddress: string,
  queryClient: QueryClient,
) => {
  const midnightUTC = new UTCDate(new UTCDate().setHours(0, 0, 0, 0));
  const startDate = subDays(midnightUTC, 365);
  const endDate = midnightUTC;

  await queryClient.prefetchQuery({
    retry: (errorCount) => {
      return errorCount < 1;
    },
    queryKey: [
      QUERY_KEYS.HISTORIC_BALANCES,
      accountAddress,
      startDate,
      endDate,
    ],
    queryFn: () =>
      withTimeout(
        async () => {
          const data = await fetchHistoricalBalances(accountAddress, {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          });
          const convertedData = data.map((timeSeriesData) => {
            const balanceData = timeSeriesData.value;
            const convertedBalances = Object.keys(balanceData).map((denom) => {
              const asset = queryClient.getQueryData<OriginAsset>([
                QUERY_KEYS.ORIGIN_ASSET,
                denom,
              ]);
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

  await queryClient.prefetchQuery({
    staleTime: 1000 * 60 * 10, // 10 mins,
    retry: (errorCount) => {
      return errorCount < 1;
    },
    queryKey: [
      QUERY_KEYS.HISTORIC_TARGETS,
      accountAddress,
      startDate.toISOString(),
      endDate.toISOString(),
    ],
    queryFn: () =>
      withTimeout(async () => {
        return fetchHistoricalTargets({
          address: accountAddress,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
      }, QUERY_KEYS.HISTORIC_TARGETS),
  });
};

// fetch config, valence account, and live balances
export const prefetchLiveAccountData = async (
  queryClient: QueryClient,
  account: string,
) => {
  await queryClient.prefetchQuery({
    retry: (errorCount) => {
      return errorCount < 1;
    },
    queryKey: [QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG, account],

    queryFn: () => {
      return fetchRebalancerAccountConfiguration({
        address: account,
      });
    },
  });
};
