import type { Metadata } from "next";
import { getStories } from "~/lib";
import { SandboxNav } from "~/components";
import "@valence-ui/ui-components/styles/index.css";
import { Toaster } from "@valence-ui/ui-components";

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
      <body className="">
        <div className="flex flex-row h-screen">
          <SandboxNav stories={stories} />
          <Toaster />
          <div className="grow overflow-y-scroll"> {children}</div>
        </div>
      </body>
    </html>
  );
}
