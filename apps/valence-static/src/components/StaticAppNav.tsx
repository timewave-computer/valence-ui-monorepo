"use client";
import { usePathname } from "next/navigation";
import { IoMdMenu } from "react-icons/io";
import {
  cn,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@valence-ui/ui-components";
import Link from "next/link";
import { APP_URL, DOCS_URL, VAULTS_URL } from "@valence-ui/socials";
import { HiMiniArrowRight } from "react-icons/hi2";
import { HomepageButton, ValenceLogo } from "~/components";

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
    <Link
      target={blankTarget ? "_blank" : ""}
      key={`nav-${href}`}
      className={cn(
        "relative top-[1px] flex flex-row items-center font-medium decoration-valence-black underline-offset-2 decoration-2 ",
        shouldHightlightItem(href, path) && "underline ",
        "transition-all focus:underline ", // mobile,
      )}
      href={href}
    >
      {label}
    </Link>
  );
};

const LaunchButton = () => (
  <Link target="_blank" href={APP_URL + "/rebalancer"}>
    <HomepageButton tabIndex={-1} SuffixIcon={HiMiniArrowRight}>
      Apps
    </HomepageButton>
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
      <div className="hidden lg:flex flex-row max-w-5xl p-8 mx-auto w-full justify-between items-center text-valence-black border-b-[1px] border-valence-black     ">
        <Link href="/">
          {" "}
          <ValenceLogo className="-ml-1" />
        </Link>

        <div className="flex flex-row items-center gap-20">
          {links}

          <LaunchButton />
        </div>
      </div>

      {/* mobile */}
      <div className="flex flex-row gap-4 items-center justify-between w-full px-4 lg:hidden border-b border-valence-black  py-4">
        <Link href="/">
          {" "}
          <ValenceLogo className="-ml-1" />
        </Link>

        <Sheet>
          <SheetTrigger asChild className="outline-none">
            <HomepageButton
              variant="secondary"
              className="min-w-0 transform border-none  transition-transform active:scale-90
              focus:bg-valence-white hover:text-valence-black border-0 hover:bg-valence-white
               "
            >
              <IoMdMenu className="h-6 w-6  " />
            </HomepageButton>
          </SheetTrigger>

          <SheetContent className=" w-3/4 px-8 py-6 ">
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
