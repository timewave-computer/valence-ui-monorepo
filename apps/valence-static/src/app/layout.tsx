import type { Metadata } from "next";
import { Footer, StaticAppNav } from "~/components";
import { cn } from "@valence-ui/ui-components";
import { ReactQueryProvider } from "~/context";
import { ABSOLUTE_URL, VALENCE_DESCRIPTION } from "~/const";
import { X_HANDLE } from "@valence-ui/socials";
import { Unica77, Unica77Mono } from "@valence-ui/fonts";
import "@valence-ui/ui-components/styles/index.css";

import React from "react";

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
  return (
    <>
      <ReactQueryProvider>
        <html
          lang="en"
          className={`${Unica77.variable} ${Unica77Mono.variable} --font-sans`}
        >
          <body
            className={cn(
              "flex max-h-screen min-h-screen px-0 md:px-4 flex-col text-valence-black bg-valence-white overflow-y-scroll",
            )}
          >
            <StaticAppNav />
            {children}
            <Footer />
          </body>
        </html>
      </ReactQueryProvider>
    </>
  );
}
