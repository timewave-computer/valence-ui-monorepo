import type { Metadata } from "next";
import { ABSOLUTE_URL, COVENANT_DESCRIPTION, X_HANDLE } from "@/const/socials";

export const metadata: Metadata = {
  title: "Covenants",
  description: COVENANT_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: COVENANT_DESCRIPTION,
    url: `${ABSOLUTE_URL}/covenants`,
    images: ["/img/opengraph/covenants-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary",
    images: ["/img/opengraph/covenants-og.png"],
    description: COVENANT_DESCRIPTION,
  },
};

export default function RebalancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
