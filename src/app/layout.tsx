import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
import { ReactQueryProvider } from "@/context";
import { Provider as JotaiProvider } from "jotai";
import { FeatureFlags } from "@/const/feature-flags";
import { FeatureFlagsProvider } from "@/context/feature-flags-provider";
import { ABSOLUTE_URL, VALENCE_DESCRIPTION, X_HANDLE } from "@/const/socials";
import { Analytics } from "@vercel/analytics/react";

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
    <>
      <Analytics />
      <ReactQueryProvider>
        <JotaiProvider>
          <FeatureFlagsProvider flags={flags}>
            <html lang="en">
              <body
                className={cn(
                  inter.className,
                  "flex max-h-screen min-h-screen flex-col text-valence-black",
                )}
              >
                <Nav />
                {children}
              </body>
            </html>
          </FeatureFlagsProvider>
        </JotaiProvider>
      </ReactQueryProvider>
    </>
  );
}

const getFeatureFlags = () => {
  const flags: Record<string, boolean> = {};
  Object.keys(FeatureFlags).forEach((key) => {
    const envVar = `FF_${key}`;
    flags[key] = process.env[envVar] === "true" ? true : false;
  });
  return flags;
};
