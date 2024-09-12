import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { RebalancerMainClient } from "./RebalancerMainClient";
import {
  prefetchAuctionData,
  prefetchHistoricalData,
  prefetchLiveAccountData,
  prefetchMetadata,
} from "@/server/prefetch";

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
  const queryClient = new QueryClient();
  await prefetchMetadata(queryClient);
  await prefetchAuctionData(queryClient);
  await prefetchHistoricalData(queryClient, account);
  if (account && account.length > 0) {
    await prefetchLiveAccountData(queryClient, account);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RebalancerMainClient />
    </HydrationBoundary>
  );
}
