import { Metadata } from "next";
import { X_HANDLE } from "@valence-ui/socials";
import { LiveAuctionsHero, LiveAuctionsTable } from "@/app/auctions/components";
import { Suspense } from "react";
import { LoadingSkeleton } from "@valence-ui/ui-components";
import { fetchLiveAuctions, fetchAssetMetadata } from "@/server/actions";
import { chainConfig, ABSOLUTE_URL, AUCTIONS_DESCRIPTION } from "@/const";

export const revalidate = 60;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Auctions",
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
  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <LiveAuctionsHero />
      <div className="flex w-full grow flex-col items-center self-center pt-8 ">
        <Suspense fallback={<Loading />}>
          <LiveAuctionsTableWithSuspense />
        </Suspense>
      </div>
    </main>
  );
}

async function LiveAuctionsTableWithSuspense() {
  const denomList = chainConfig.supportedRebalancerAssets.map((a) => a.denom);
  const [metadata, auctionsData] = await Promise.all([
    fetchAssetMetadata([
      {
        denoms: denomList,
        chainId: chainConfig.chain.chain_id,
      },
    ]),
    fetchLiveAuctions(),
  ]);

  return (
    <LiveAuctionsTable
      initialMetadata={metadata}
      initialAuctionsData={auctionsData}
    />
  );
}

const Loading = () => {
  // if page is statically generated this will not show in production
  return (
    <>
      <LoadingSkeleton className="h-[72px] w-3/4 sm:w-1/3" />
      <div className="flex w-full max-w-[1600px] grow flex-col pt-4">
        <LoadingSkeleton className=" h-full w-full grow" />
      </div>
    </>
  );
};
