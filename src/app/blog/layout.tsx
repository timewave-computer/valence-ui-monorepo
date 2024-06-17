import { Footer } from "@/components";
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
      <div className=" mx-auto flex max-w-3xl grow flex-col px-4 pb-4 pt-8">
        {children}

        <Footer className="border-t border-valence-black pb-4 pt-4 md:pb-12" />
      </div>
    </main>
  );
}
