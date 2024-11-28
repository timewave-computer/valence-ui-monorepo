import type { Metadata } from "next";
import { ABSOLUTE_URL, REBALANCER_DESCRIPTION } from "@/const";
import { X_HANDLE } from "@valence-ui/socials";
import { Suspense } from "react";
import {
  HistoricalGraph,
  AccountDetailsPanel,
  SidePanelV2,
} from "@/app/rebalancer/ui";
import { RebalancerMainServerComponent } from "@/app/rebalancer/server";

export const metadata: Metadata = {
  title: "Rebalancer",
  description: REBALANCER_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: REBALANCER_DESCRIPTION,
    url: `${ABSOLUTE_URL}/rebalancer`,
    images: ["/img/opengraph/rebalancer-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/rebalancer-og.png"],
    description: REBALANCER_DESCRIPTION,
  },
};

function RebalancerMainSuspenseFallback() {
  return (
    <div className=" flex w-full flex-row">
      <SidePanelV2 />
      <div className="flex min-w-[824px] grow  flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
        <HistoricalGraph isLoading={false} isError={false} />
        <AccountDetailsPanel />
      </div>
    </div>
  );
}

export default async function RebalancerPage({
  searchParams: { account },
}: {
  searchParams: {
    account: string;
  };
}) {
  return (
    // doing this instead of loading.tsx to provide search param as a key, to trigger loading state on account change
    <Suspense key={account} fallback={<RebalancerMainSuspenseFallback />}>
      <RebalancerMainServerComponent searchParams={{ account }} />
    </Suspense>
  );
}
