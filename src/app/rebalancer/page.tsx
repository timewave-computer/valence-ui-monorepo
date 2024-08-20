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
} from "@/server/actions";
import { chainConfig } from "@/const/config";
import type { Metadata } from "next";
import {
  ABSOLUTE_URL,
  REBALANCER_DESCRIPTION,
  X_HANDLE,
} from "@/const/socials";
import { withTimeout } from "./hooks";
import { RebalancerMain } from "./RebalancerMain";
import { UTCDate } from "@date-fns/utc";
import { subDays } from "date-fns";
import { OriginAsset } from "@/types/ibc";
import { microToBase } from "@/utils";

export const metadata: Metadata = {
  title: "Valence Rebalancer",
  description: REBALANCER_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: REBALANCER_DESCRIPTION,
    url: `${ABSOLUTE_URL}/rebalancer`,
    images: ["/img/opengraph/rebalancer-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/rebalancer-og.png"],
    description: REBALANCER_DESCRIPTION,
  },
};

const prefetchDataForAccount = async (
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

export default async function RebalancerPage({
  searchParams: { account },
}: {
  searchParams: {
    account: string;
  };
}) {
  const queryClient = new QueryClient();

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

  await Promise.all(prefetchedHistoricPrices);
  if (account && account.length > 0) {
    // TODO: await this
    prefetchDataForAccount(account, queryClient);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RebalancerMain />
    </HydrationBoundary>
  );
}
