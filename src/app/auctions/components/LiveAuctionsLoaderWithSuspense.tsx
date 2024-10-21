import { LiveAuctionsTable } from "@/app/auctions/components";
import { getQueryClient } from "@/utils/get-query-client";
import { prefetchLiveAuctions } from "@/server/prefetch";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export async function LiveAuctionsLoaderWithSuspense() {
  // component 'suspended' with useSuspenseQuery
  return (
    <Suspense fallback={<Loading />}>
      <LiveAuctionsLoader />
    </Suspense>
  );
}

async function LiveAuctionsLoader() {
  const queryClient = getQueryClient();
  await prefetchLiveAuctions(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LiveAuctionsTable />
    </HydrationBoundary>
  );
}

const Loading = () => {
  return (
    <>
      <LoadingSkeleton className="h-[44px] w-3/4 sm:w-1/3" />
      <div className="flex w-full max-w-[1600px] grow flex-col pt-4">
        <LoadingSkeleton className=" h-full w-full grow" />
      </div>
    </>
  );
};
