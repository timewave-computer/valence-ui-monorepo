"use client";

import { cn } from "@/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { Button } from "./Button";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";

export const Nav = () => {
  const path = usePathname();

  const Links = () => (
    <>
      {" "}
      <a
        className={cn(
          "relative top-[1px] flex flex-row items-center",
          "transform transition-transform active:scale-95 active:font-extrabold",
          path.startsWith("/covenant") && "font-bold",
        )}
        href="/covenant"
      >
        Covenant
      </a>
      <a
        className={cn(
          "relative top-[1px] flex flex-row items-center",
          "transform transition-transform active:scale-95 active:font-extrabold",
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
        <Sheet>
          <SheetTrigger asChild className="outline-none">
            <Button
              variant="secondary"
              className="transform border-none  transition-transform active:scale-90 "
            >
              <IoMdMenu className="h-6 w-6 " />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <div className=" flex flex-col gap-8 p-4 text-xl">
              <a
                className={cn(
                  "relative top-[1px] flex transform flex-row items-center transition-transform active:scale-95 active:font-extrabold",
                  path === "/" && "font-bold",
                )}
                href="/"
              >
                Home
              </a>
              <Links />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
