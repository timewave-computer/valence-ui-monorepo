import { SidePanelV2 } from "@/app/rebalancer/ui";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ABSOLUTE_URL, EDIT_REBALANCER_DESCRIPTION } from "@/const";
import { X_HANDLE } from "@valence-ui/socials";
import { microToBase } from "@/utils";
import { EditRebalancer } from "../../ui/edit-rebalancer/EditRebalancer";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  fetchRebalancerAccountBalances,
  fetchRebalancerWhitelist,
} from "@/server/actions";
import { BalanceReturnValue } from "../../hooks";
import { OriginAsset } from "@/types/ibc";
import { ErrorHandler } from "@/const/error";
import {
  prefetchAccountConfiguration,
  prefetchAssetMetdata,
  prefetchLivePrices,
} from "@/server/prefetch";

export const metadata: Metadata = {
  title: "Edit Rebalancer",
  description: EDIT_REBALANCER_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: EDIT_REBALANCER_DESCRIPTION,
    url: `${ABSOLUTE_URL}/rebalancer/create`,
    images: ["/img/opengraph/rebalancer-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/rebalancer-og.png"],
    description: EDIT_REBALANCER_DESCRIPTION,
  },
};

type EditRebalancerProps = {
  params: {
    address: string;
  };
};

export default async function CreateRebalancerPage({
  params: { address },
}: EditRebalancerProps) {
  if (!address) {
    redirect("/rebalancer");
  }

  const queryClient = new QueryClient();
  await prefetchAssetMetdata(queryClient);
  prefetchLivePrices(queryClient);

  const prefetchRequests = [
    prefetchAssetMetdata(queryClient),
    prefetchLivePrices(queryClient),
    prefetchAccountConfiguration(queryClient, address),
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.REBALANCER_WHITELIST],
      queryFn: () => fetchRebalancerWhitelist(),
    }),
    queryClient.prefetchQuery({
      retry: (errorCount) => {
        return errorCount < 2;
      },
      queryKey: [QUERY_KEYS.ACCOUNT_BALANCES, address],
      queryFn: (): Promise<BalanceReturnValue> => {
        return new Promise(async (resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Request timed out"));
          }, 5000);

          try {
            const rawBalances = await fetchRebalancerAccountBalances({
              address: address,
            });
            clearTimeout(timeout);
            // balances from stargate client returned in micro units
            const processedBalances = rawBalances.map((balance) => {
              const asset = queryClient.getQueryData<OriginAsset>([
                QUERY_KEYS.ORIGIN_ASSET,
                balance.denom,
              ]);
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
    }),
  ];

  await Promise.all(prefetchRequests);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className=" flex w-full flex-row">
        <SidePanelV2 rerouteOnConnect={false} />
        <EditRebalancer address={address} />
      </div>
    </HydrationBoundary>
  );
}
