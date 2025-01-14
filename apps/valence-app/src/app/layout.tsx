import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@valence-ui/ui-components/styles/index.css";
import { cn } from "@/utils";
import {
  ReactQueryProvider,
  FeatureFlagsProvider,
  CosmosProvider,
} from "@/context";
import { Provider as JotaiProvider } from "jotai";
import { X_HANDLE } from "@valence-ui/socials";
import { ABSOLUTE_URL, VALENCE_DESCRIPTION } from "@/const";
import { getFeatureFlags } from "@/utils";
import { ValenceAppNav } from "@/components";
import React from "react";
import { Toaster } from "@valence-ui/ui-components";
import ReactQueryDevToolsWithProd from "@/components/react-query-devtools";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valence",
  metadataBase: new URL(ABSOLUTE_URL),
  description: VALENCE_DESCRIPTION,
  openGraph: {
    siteName: "Valence",
    description: VALENCE_DESCRIPTION,
    url: ABSOLUTE_URL,
    images: ["/img/opengraph/valence-horizontal-og.png"],
  },
  twitter: {
    creator: X_HANDLE,
    card: "summary_large_image",
    images: ["/img/opengraph/valence-horizontal-og.png"],
    description: VALENCE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flags = getFeatureFlags();
  return (
    <html>
      <body
        className={cn(
          inter.className,
          "flex max-h-screen min-h-screen grow flex-col text-valence-black",
        )}
      >
        <ReactQueryProvider>
          <JotaiProvider>
            <FeatureFlagsProvider flags={flags}>
              <CosmosProvider>
                <ReactQueryDevToolsWithProd />
                <ValenceAppNav />
                {children}
                <Toaster />
              </CosmosProvider>
            </FeatureFlagsProvider>
          </JotaiProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
