import { FeatureFlags, isFeatureFlagEnabled } from "@/utils";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/utils/get-query-client";
import { prefetchAssetMetdata } from "@/server/prefetch";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { ABSOLUTE_URL, AUCTIONS_DESCRIPTION, X_HANDLE } from "@/const/socials";
import { LiveAuctionsHero } from "@/app/auctions/components";
import { LiveAuctionsTable } from "@/app/auctions/components";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components";
import { fetchLiveAuctions } from "@/server/actions";

export const revalidate = 60;

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
  await prefetchAssetMetdata(queryClient);

  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <LiveAuctionsHero />
      <div className="flex w-full grow flex-col items-center self-center pt-8 ">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<Loading />}>
            <LoaderWithSuspense />
          </Suspense>
        </HydrationBoundary>
      </div>
    </main>
  );
}

async function LoaderWithSuspense() {
  const auctions = await fetchLiveAuctions();
  return <LiveAuctionsTable initialAuctionsData={auctions} />;
}

const Loading = () => {
  // if page is statically generated this will not show in production
  return (
    <>
      <LoadingSkeleton className="h-[44px] w-3/4 sm:w-1/3" />
      <div className="flex w-full max-w-[1600px] grow flex-col pt-4">
        <LoadingSkeleton className=" h-full w-full grow" />
      </div>
    </>
  );
};
