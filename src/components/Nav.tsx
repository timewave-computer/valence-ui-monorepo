"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";

export const Nav = () => {
  const path = usePathname();

  return (
    <nav className="bg-white shrink-0 flex flex-row gap-6 items-center border-b-2 border-black text-black">
      <a className="flex justify-center items-center p-4" href="/">
        Valence
      </a>

      <a
        className={clsx(
          "flex justify-center items-center p-4",
          path.startsWith("/covenant") && "font-bold"
        )}
        href="/covenant"
      >
        Covenant
      </a>

      <a
        className={clsx(
          "flex justify-center items-center p-4",
          path.startsWith("/rebalancer") && "font-bold"
        )}
        href="/rebalancer"
      >
        Rebalancer
      </a>
    </nav>
  );
};
