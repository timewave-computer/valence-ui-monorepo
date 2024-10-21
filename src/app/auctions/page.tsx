import { FeatureFlags, isFeatureFlagEnabled } from "@/utils";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/utils/get-query-client";
import { prefetchAssetMetdata } from "@/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { ABSOLUTE_URL, AUCTIONS_DESCRIPTION, X_HANDLE } from "@/const/socials";
import {
  LiveAuctionsHero,
  LiveAuctionsLoaderWithSuspense,
} from "@/app/auctions/components";

export const metadata: Metadata = {
  title: "Valence Auctions",
  description: AUCTIONS_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: AUCTIONS_DESCRIPTION,
    url: `${ABSOLUTE_URL}/auctions`,
    images: ["/img/opengraph/auctions-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/auctions-og.png"],
    description: AUCTIONS_DESCRIPTION,
  },
};

export default async function AuctionsPage() {
  const isEnabled = isFeatureFlagEnabled(FeatureFlags.AUCTIONS_LIVE_AGGREGATE);
  if (!isEnabled) redirect("/");
  const queryClient = getQueryClient();
  await prefetchAssetMetdata(queryClient); // necessary for page display (cached stuff). its OK for this to be 'stale' its virtually static

  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <LiveAuctionsHero />
      <div className="flex w-full grow flex-col items-center self-center pt-8 ">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <LiveAuctionsLoaderWithSuspense />
        </HydrationBoundary>
      </div>
    </main>
  );
}
