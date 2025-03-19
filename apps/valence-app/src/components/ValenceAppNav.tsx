"use client";
import { FeatureFlags, useFeatureFlag } from "@/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  Button,
  cn,
} from "@valence-ui/ui-components";
import { useWalletBalances } from "@/hooks";
import { STATIC_URL } from "@/const";
import { ConnectWalletButton } from "@/components";
import { useAccount } from "graz";

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

export const ValenceAppNav = () => {
  const path = usePathname();

  const isAuctionsEnabled = useFeatureFlag(
    FeatureFlags.AUCTIONS_LIVE_AGGREGATE,
  );

  const links = (
    <>
      <NavLink href="/covenants" label="Covenants" path={path} />
      <NavLink href="/rebalancer" label="Rebalancer" path={path} />
      {isAuctionsEnabled && (
        <NavLink href="/auctions" label="Auctions" path={path} />
      )}
    </>
  );

  return (
    <nav
      className={cn(
        "min-h-[4rem]",
        "py-0.5",
        "flex flex-row items-center justify-between border-b border-valence-black bg-valence-white px-4 text-valence-black",
      )}
    >
      <div className="flex items-center gap-2 md:gap-8">
        <a className="" target="_blank" href={STATIC_URL}>
          <Image
            priority={true}
            src="/img/valence_horizontal.svg"
            alt="Logo"
            width={110}
            height={38}
          />
        </a>
        <div className="hidden flex-row gap-8 md:flex">{links}</div>
      </div>

      {<ConnectWalletButton />}

      <div className="flex md:hidden">
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
            <div className=" flex flex-col gap-8 p-4 text-h2">{links}</div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
