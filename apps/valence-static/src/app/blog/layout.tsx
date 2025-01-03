import type { Metadata } from "next";
import type { FC, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Valence Blog",
  description: "",
};

const BlogLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main className="flex grow flex-col bg-white ">
      <div className=" mx-auto flex max-w-5xl grow flex-col px-4 md:px-0">
        {children}
      </div>
    </main>
  );
};
