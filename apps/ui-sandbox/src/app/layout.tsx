import type { Metadata } from "next";
import "@valence-ui/ui-components/styles/index.css";
import { getStories } from "~/lib";
import { SandboxNav } from "~/components";

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
        <div className="flex flex-row">
          <SandboxNav stories={stories} />
          <div className="grow"> {children}</div>
        </div>
      </body>
    </html>
  );
}
