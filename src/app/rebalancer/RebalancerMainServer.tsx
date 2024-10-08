import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { RebalancerMainClient } from "./RebalancerMainClient";
import {
  prefetchAuctionLimits,
  prefetchAuctionStatuses,
  prefetchHistoricalPrices,
  prefetchAccountConfiguration,
  prefetchMetadata,
  prefetchHistoricalTargets,
  prefetchHistoricalBalances,
  prefetchLivePrices,
} from "@/server/prefetch";
import { getQueryClient } from "@/utils/get-query-client";

/***
 * making own server component to prefetch data with a manual suspense boundary to provide search params as a key
 */
export default async function RebalancerMainServerComponent({
  searchParams: { account },
}: {
  searchParams: {
    account: string;
  };
}) {
  const queryClient = getQueryClient();

  if (account && account.length > 0) {
    const requests = [
      prefetchMetadata(queryClient),
      prefetchLivePrices(queryClient),
      prefetchAuctionLimits(queryClient),
      prefetchAuctionStatuses(queryClient),
      prefetchHistoricalPrices(queryClient),
    ];
    const accountSpecificRequests = [
      prefetchAccountConfiguration(queryClient, account),
      prefetchHistoricalTargets(queryClient, account),
      prefetchHistoricalBalances(queryClient, account),
    ];
    requests.concat(accountSpecificRequests);
    await Promise.all(requests);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RebalancerMainClient account={account} />
    </HydrationBoundary>
  );
}
