import type { Metadata } from "next";
import {
  ABSOLUTE_URL,
  REBALANCER_DESCRIPTION,
  X_HANDLE,
} from "@/const/socials";
import { MobileOverlay } from "@/components";
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

export default function RebalancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex grow flex-col bg-valence-white text-valence-black">
      <MobileOverlay text="The Rebalancer is only available on desktop." />
      <div className="hidden grow sm:flex">{children}</div>
    </main>
  );
}
