import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
import { ReactQueryProvider } from "@/context";
import { Provider as JotaiProvider } from "jotai";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valence",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <JotaiProvider>
        <html lang="en">
          <body
            className={cn(
              inter.className,
              "flex max-h-screen min-h-screen flex-col",
            )}
          >
            <Nav />

            {children}
          </body>
        </html>
      </JotaiProvider>
    </ReactQueryProvider>
  );
}
