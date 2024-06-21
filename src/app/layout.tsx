import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
import { ReactQueryProvider } from "@/context";
import { Provider as JotaiProvider } from "jotai";
import { FeatureFlags } from "@/const/feature-flags";
import { FeatureFlagsProvider } from "@/context/feature-flags-provider";
import { VALENCE_DESCRIPTION } from "@/const/socials";

const ABSOLUTE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "https://valence.zone";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valence",
  description: VALENCE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const flags = getFeatureFlags();
  return (
    <ReactQueryProvider>
      <JotaiProvider>
        <FeatureFlagsProvider flags={flags}>
          <html lang="en">
            <meta property="description" content={VALENCE_DESCRIPTION} />
            <meta property="og:site_name" content="Valence" />
            <meta property="og:description" content={VALENCE_DESCRIPTION} />
            <meta property="og:url" content={ABSOLUTE_URL} />
            <meta
              property="twitter:description"
              content={VALENCE_DESCRIPTION}
            ></meta>
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
