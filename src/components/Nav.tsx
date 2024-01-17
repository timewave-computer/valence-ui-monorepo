"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const Nav = () => {
  const path = usePathname();

  return path === "/" ? null : (
    <nav className="bg-white shrink-0 flex flex-row gap-6 items-center border-b border-black text-black">
      <a className="flex flex-row items-center gap-1 p-4 text-2xl font-serif" href="/">
        <Image src="/img/valence.png" alt="Logo" width={30} height={42} />

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
