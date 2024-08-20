import { SidePanelV2 } from "@/app/rebalancer/components";
import CreateRebalancer from "./CreateRebalancer";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  ABSOLUTE_URL,
  CREATE_REBALANCER_DESCRIPTION,
  X_HANDLE,
} from "@/const/socials";
import { FeatureFlags, isFeatureFlagEnabled } from "@/utils";

export const metadata: Metadata = {
  title: "Start Rebalancing",
  description: CREATE_REBALANCER_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: CREATE_REBALANCER_DESCRIPTION,
    url: `${ABSOLUTE_URL}/rebalancer/create`,
    images: ["/img/opengraph/rebalancer-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/rebalancer-og.png"],
    description: CREATE_REBALANCER_DESCRIPTION,
  },
};

type CreateRebalancerProps = {};

export default function CreateRebalancerPage({}: CreateRebalancerProps) {
  const enabled = isFeatureFlagEnabled(FeatureFlags.REBALANCER_CREATE);

  if (!enabled) {
    redirect("/rebalancer");
  }

  return (
    <div className=" flex w-full flex-row">
      <SidePanelV2 />
      <CreateRebalancer />
    </div>
  );
}
