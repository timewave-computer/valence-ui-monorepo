"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const Nav = () => {
  const path = usePathname();

  return path === "/" ? null : (
    <nav className="bg-valence-white shrink-0 flex flex-row gap-8 items-center border-b border-valence-black text-valence-black px-4 h-[3.25rem]">
      <a
        className="flex flex-row items-center"
        href="/"
      >
        <Image
          src="/img/valence_horizontal.svg"
          alt="Logo"
          width={110}
          height={38}
        />
      </a>

      <a
        className={clsx(
          "flex flex-row items-center top-[1px] relative",
          path.startsWith("/covenant") && "font-bold"
        )}
        href="/covenant"
      >
        Covenant
      </a>

      <a
        className={clsx(
          "flex flex-row items-center top-[1px] relative",
          path.startsWith("/rebalancer") && "font-bold"
        )}
        href="/rebalancer"
      >
        Rebalancer
      </a>
    </nav>
  );
};
