import { SidePanelV2, CreateRebalancer } from "@/app/rebalancer/ui";
import type { Metadata } from "next";
import { CREATE_REBALANCER_DESCRIPTION, ABSOLUTE_URL } from "@/const";
import { X_HANDLE } from "@valence-ui/socials";
import { fetchRebalancerWhitelist } from "@/server/actions";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { prefetchAssetMetdata, prefetchLivePrices } from "@/server/prefetch";

export const metadata: Metadata = {
  title: "Start Rebalancing",
  description: CREATE_REBALANCER_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: CREATE_REBALANCER_DESCRIPTION,
    url: `${ABSOLUTE_URL}/rebalancer/create`,
    images: ["/img/opengraph/rebalancer-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/rebalancer-og.png"],
    description: CREATE_REBALANCER_DESCRIPTION,
  },
};

type CreateRebalancerProps = {};

export default async function CreateRebalancerPage({}: CreateRebalancerProps) {
  const queryClient = new QueryClient();
  const prefetchRequests = [
    prefetchAssetMetdata(queryClient),
    prefetchLivePrices(queryClient),
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.REBALANCER_WHITELIST],
      queryFn: () => fetchRebalancerWhitelist(),
    }),
  ];

  await Promise.all(prefetchRequests);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className=" flex w-full flex-row">
        <SidePanelV2 rerouteOnConnect={false} />
        <CreateRebalancer />
      </div>
    </HydrationBoundary>
  );
}
