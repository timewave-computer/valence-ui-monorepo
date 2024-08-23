import { SidePanelV2 } from "@/app/rebalancer/components";
import CreateRebalancer from "./CreateRebalancer";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  ABSOLUTE_URL,
  CREATE_REBALANCER_DESCRIPTION,
  X_HANDLE,
} from "@/const/socials";
import { FeatureFlags, isFeatureFlagEnabled } from "@/utils";
import { fetchRebalancerWhitelist } from "@/server/actions";
import { QUERY_KEYS } from "@/const/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { prefetchMetadata } from "@/server/prefetch";

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
  const enabled = isFeatureFlagEnabled(FeatureFlags.REBALANCER_CREATE);

  if (!enabled) {
    redirect("/rebalancer");
  }

  const queryClient = new QueryClient();
  await prefetchMetadata(queryClient);
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEYS.REBALANCER_WHITELIST],
    queryFn: () => fetchRebalancerWhitelist(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className=" flex w-full flex-row">
        <SidePanelV2 />
        <CreateRebalancer />
      </div>
    </HydrationBoundary>
  );
}
