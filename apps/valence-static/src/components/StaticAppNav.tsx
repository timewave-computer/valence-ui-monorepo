"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { Button, cn } from "@valence-ui/ui-components";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import { CgExternal } from "react-icons/cg";
import Link from "next/link";
import { appUrl } from "~/utils";

const shouldHightlightItem = (href: string, path: string) => {
  if (href === "/")
    return path === "/"; // special case for home
  else return path.startsWith(href);
};

const NavLink = ({
  href,
  label,
  path,
}: {
  href: string;
  label: string;
  path: string;
}) => {
  return (
    <a
      key={`nav-${href}`}
      className={cn(
        "relative top-[1px] flex flex-row items-center",
        shouldHightlightItem(href, path) && "font-bold",
        "transition-all focus:font-bold", // mobile,
        "md:focus:font-normal",
      )}
      href={href}
    >
      {label}
    </a>
  );
};

const LaunchButton = () => (
  <Link href={appUrl}>
    <Button tabIndex={-1}>
      Launch App
      <CgExternal className="h-6 w-6 ml-1" />
    </Button>
  </Link>
);
export const StaticAppNav = () => {
  const path = usePathname();
  const links = (
    <>
      <NavLink href="/blog" label="Blog" path={path} />
    </>
  );

  return (
    <nav
      className={cn(
        "flex  flex-row items-center justify-between py-4  bg-valence-white  text-valence-black",
      )}
    >
      {/* desktop */}
      <div className="hidden md:flex flex-row max-w-5xl py-4 mx-auto w-full justify-between px-4 ">
        <a href="/">
          <Image
            src="/img/valence_vertical.svg"
            alt="Logo"
            width={120}
            height={92}
          />
        </a>

        <div className="flex items-center gap-2 md:gap-8">
          <LaunchButton />
        </div>
      </div>

      {/* mobile */}
      <div className="flex flex-row justify-between w-full px-4 md:hidden border-b border-valence-black pb-4">
        <a className="" href="/">
          <Image
            src="/img/valence_horizontal.svg"
            alt="Logo"
            width={110}
            height={38}
          />
        </a>
        <Sheet>
          <SheetTrigger asChild className="outline-none">
            <Button
              variant="secondary"
              className=" min-w-0 transform border-none  transition-transform active:scale-90
               "
            >
              <IoMdMenu className="h-6 w-6  " />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <div className=" flex flex-col gap-8 p-4 text-xl">
              {/* special case for mobile */}
              <NavLink href="/" label="Home" path={path} />
              {links}
              <LaunchButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
