import type { Metadata } from "next";
import {
  ABSOLUTE_URL,
  REBALANCER_DESCRIPTION,
  X_HANDLE,
} from "@/const/socials";

import { Suspense } from "react";
import { AccountDetailsPanel, SidePanelV2 } from "./components";
import { HistoricalGraph } from "./components/HistoricalGraph";
import RebalancerMainServerComponent from "./RebalancerMainServer";

export const metadata: Metadata = {
  title: "Valence Rebalancer",
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
        <HistoricalGraph isLoading={true} isError={false} />
        <AccountDetailsPanel selectedAddress="" />
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
