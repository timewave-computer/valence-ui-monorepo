"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import {
  Button,
  cn,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@valence-ui/ui-components";
import Link from "next/link";
import { APP_URL, DOCS_URL, VAULTS_URL } from "@valence-ui/socials";
import { HiMiniArrowRight } from "react-icons/hi2";

const shouldHightlightItem = (href: string, path: string) => {
  if (href === "/")
    return path === "/"; // special case for home
  else return path.startsWith(href);
};

const NavLink = ({
  href,
  label,
  path,
  blankTarget,
}: {
  href: string;
  label: string;
  path: string;
  blankTarget?: boolean;
}) => {
  return (
    <a
      target={blankTarget ? "_blank" : ""}
      key={`nav-${href}`}
      className={cn(
        "relative top-[1px] flex flex-row items-center ",
        shouldHightlightItem(href, path) && "font-semibold",
        "transition-all focus:font-semibold", // mobile,
        "md:focus:font-normal",
      )}
      href={href}
    >
      {label}
    </a>
  );
};

const LaunchButton = () => (
  <Link target="_blank" href={APP_URL + "/rebalancer"}>
    <Button tabIndex={-1} SuffixIcon={HiMiniArrowRight}>
      Apps
    </Button>
  </Link>
);

export const StaticAppNav = () => {
  const path = usePathname();
  const links = (
    <>
      <NavLink href="/blog" label="Blog" path={path} />
      <NavLink blankTarget href={DOCS_URL} label="Developers" path={path} />
      <NavLink blankTarget href={VAULTS_URL} label="Vaults" path={path} />
    </>
  );

  return (
    <nav
      className={cn(
        "flex  flex-row items-center justify-between  bg-valence-white ",
      )}
    >
      {/* desktop */}
      <div className="hidden md:flex flex-row max-w-5xl py-8 mx-auto w-full justify-between text-valence-black border-b border-valence-black     ">
        <Link href="/" className="-ml-1">
          <Image
            priority={true}
            src="/img/valence_horizontal.svg"
            alt="Logo"
            width={120}
            height={92}
          />
        </Link>
        <div className="flex flex-row items-center gap-16">
          {links}

          <LaunchButton />
        </div>
      </div>

      {/* mobile */}
      <div className="flex flex-row justify-between w-full px-4 md:hidden border-b border-valence-black  py-4">
        <Link href="/">
          <Image
            priority={true}
            src="/img/valence_horizontal.svg"
            alt="Logo"
            width={110}
            height={38}
          />
        </Link>

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

          <SheetContent className=" w-1/2 ">
            <div className=" flex flex-col gap-8 p-4 text-h2">
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
