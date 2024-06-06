"use client";

import { cn } from "@/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { Button } from "./Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const Nav = () => {
  const path = usePathname();

  const Links = () => (
    <>
      {" "}
      <a
        className={cn(
          "relative top-[1px] flex flex-row items-center",
          path.startsWith("/covenant") && "font-bold",
        )}
        href="/covenant"
      >
        Covenant
      </a>
      <a
        className={cn(
          "relative top-[1px] flex flex-row items-center",
          path.startsWith("/rebalancer") && "font-bold",
        )}
        href="/rebalancer"
      >
        Rebalancer
      </a>
    </>
  );

  return (
    <nav
      className={cn(
        "flex min-h-[3.25rem] flex-row items-center border-b border-valence-black bg-valence-white px-4 text-valence-black",
        "justify-between gap-2 ", // mobile
        "sm:justify-start  sm:gap-8 ",
        path === "/" && "flex sm:hidden",
      )}
    >
      <a className="" href="/">
        <Image
          src="/img/valence_horizontal.svg"
          alt="Logo"
          width={110}
          height={38}
        />
      </a>
      <div className=" hidden w-0 flex-row gap-8 sm:flex">
        <Links />
      </div>
      <div className="flex sm:hidden">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild className="outline-none">
            <Button
              variant="secondary"
              className="transform border-none active:scale-90 "
            >
              <IoMdMenu className="h-6 w-6 " />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content asChild>
              <div className="z-100 flex flex-col gap-2 border border-valence-black bg-valence-white p-4 text-lg">
                <a
                  className={cn(
                    "relative top-[1px] flex flex-row items-center",
                    path === "/" && "font-bold",
                  )}
                  href="/"
                >
                  Home
                </a>
                <Links />
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </nav>
  );
};
