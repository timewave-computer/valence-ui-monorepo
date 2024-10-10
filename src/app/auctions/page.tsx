import { LiveAuctionsHero, LiveAuctionsTable } from "./components";
import { FeatureFlags, isFeatureFlagEnabled } from "@/utils";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/utils/get-query-client";
import { prefetchLiveAuctions, prefetchMetadata } from "@/server/prefetch";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { ABSOLUTE_URL, AUCTIONS_DESCRIPTION, X_HANDLE } from "@/const/socials";

// stale data blinks
export const revalidate = false;

export const metadata: Metadata = {
  title: "Valence Auctions",
  description: AUCTIONS_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: AUCTIONS_DESCRIPTION,
    url: `${ABSOLUTE_URL}/auctions`,
    images: ["/img/auctions.svg"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/auctions.svg"],
    description: AUCTIONS_DESCRIPTION,
  },
};

export default async function AuctionsLivePageWithSuspense() {
  const isEnabled = isFeatureFlagEnabled(FeatureFlags.AUCTIONS_LIVE_AGGREGATE);
  if (!isEnabled) redirect("/");

  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <LiveAuctionsHero />
      <div className="flex w-full grow flex-col items-center self-center pt-8 ">
        <Suspense fallback={<LiveAuctionsLoadingSkeleton />}>
          <AuctionsLivePage />
        </Suspense>
      </div>
    </main>
  );
}
async function AuctionsLivePage() {
  const queryClient = getQueryClient();
  await Promise.all([
    // we prefetch to load the data faster on the server
    prefetchMetadata(queryClient),
    prefetchLiveAuctions(queryClient),
  ]);

  return (
    <>
      <h1 className="text-xl font-bold">Auction Cycle X</h1>
      <p className="font-mono text-xs font-light">
        [todo] Auction start time - auction end time
      </p>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LiveAuctionsTable />
      </HydrationBoundary>
    </>
  );
}

const LiveAuctionsLoadingSkeleton = () => {
  return (
    <>
      <LoadingSkeleton className="h-12 w-1/2" />
      <div className="flex w-full max-w-[1600px] grow flex-col p-4">
        <LoadingSkeleton className=" h-full w-full grow" />
      </div>
    </>
  );
};
