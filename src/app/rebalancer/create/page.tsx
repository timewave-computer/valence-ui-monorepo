import { SidePanelV2 } from "@/app/rebalancer/components";
import CreateRebalancer from "./CreateRebalancer";
import type { Metadata } from "next";
import {
  ABSOLUTE_URL,
  CREATE_REBALANCER_DESCRIPTION,
  X_HANDLE,
} from "@/const/socials";
import { fetchRebalancerWhitelist } from "@/server/actions";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { prefetchMetadata, prefetchLivePrices } from "@/server/prefetch";

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
    prefetchMetadata(queryClient),
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
        <SidePanelV2 />
        <CreateRebalancer />
      </div>
    </HydrationBoundary>
  );
}
