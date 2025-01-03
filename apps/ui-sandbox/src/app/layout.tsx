import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@valence-ui/ui-components/styles/index.css";
import { getStories } from "~/lib";
import { SandboxNav } from "~/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valence UI Sandbox",
  description: "UI sandbox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stories = getStories();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-row">
          <SandboxNav stories={stories} />
          <div className="grow"> {children}</div>
        </div>
      </body>
    </html>
  );
}
