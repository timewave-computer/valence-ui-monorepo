import { Footer } from "~/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Valence Blog",
  description: "",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex grow flex-col bg-white ">
      <div className=" mx-auto flex max-w-5xl grow flex-col px-4 py-4  md:px-8   md:py-8">
        {children}
      </div>
    </main>
  );
}
