import { MobileOverlay } from "@/components";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { fetchOriginAssets, getPrices } from "@/server/actions";
import { chainConfig } from "@/const/config";

const getOriginAssetQueryArgs = (denom: string) => ({
  queryKey: [QUERY_KEYS.ORIGIN_ASSET, denom],
  queryFn: async () => {
    const originAsset = await fetchOriginAssets([
      {
        denom: denom,
        chain_id: chainConfig.chain.chain_id,
      },
    ]);
    return originAsset[0].asset;
  },
});

const getPriceQueryArgs = (denom: string, coingeckoId: string) => ({
  // eslint-disable-next-line @tanstack/query/exhaustive-deps
  queryKey: [QUERY_KEYS.COINGECKO_PRICE, denom],
  refetchInterval: 1000 * 60 * 5, // 5 minutes
  queryFn: async () => {
    const price = await getPrices([coingeckoId]);
    return price[coingeckoId];
  },
});

export default async function RebalancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();

  const prefetchAssetRequests = chainConfig.supportedAssets.map((asset) => {
    return queryClient.prefetchQuery(getOriginAssetQueryArgs(asset.denom));
  });

  const prefetchPrices = chainConfig.supportedAssets.map((asset) => {
    return queryClient.prefetchQuery(
      getPriceQueryArgs(asset.denom, asset.coingeckoId),
    );
  });
  await Promise.all([...prefetchAssetRequests, ...prefetchPrices]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex grow flex-col bg-valence-white text-valence-black">
        <MobileOverlay text="The Rebalancer is only available on desktop." />
        <div className="hidden grow overflow-clip sm:flex">{children}</div>
      </main>
    </HydrationBoundary>
  );
}
