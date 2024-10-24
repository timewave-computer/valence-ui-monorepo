import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
import { ReactQueryProvider } from "@/context";
import { ABSOLUTE_URL, VALENCE_DESCRIPTION, X_HANDLE } from "@/const/socials";

import React from "react";

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
  return (
    <>
      <ReactQueryProvider>
        <html lang="en">
          <body
            className={cn(
              inter.className,
              "flex max-h-screen min-h-screen grow flex-col text-valence-black",
            )}
          >
            <Nav />
            {children}
          </body>
        </html>
      </ReactQueryProvider>
    </>
  );
}
