"use client";
import { cn, displayAddress, FeatureFlags, useFeatureFlag } from "@/utils";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  Button,
  Label,
} from "@valence-ui/ui-components";
import { useChainContext, useWalletBalances, useWallet } from "@/hooks";
import * as Popover from "@radix-ui/react-popover";
import { STATIC_URL } from "@/const";

export const NAV_HEIGHT = "4rem";
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
  const { chain } = useChainContext();
  const { address, disconnect, isWalletConnected, walletInfo } = useWallet();

  // TODO: hydrate this on server so we dont have to call it unless user decides to click 'create'
  useWalletBalances(address);

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
        `$min-h-${NAV_HEIGHT}`,
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

      {isWalletConnected && address && (
        <Popover.Root>
          <Popover.Trigger>
            <Button
              className={cn(
                "font-mono text-xs py-1 min-h-0",
                "hidden md:flex", // hide on mobile
              )}
              variant="secondary"
            >
              {" "}
              {displayAddress(address)}
            </Button>
          </Popover.Trigger>

          <Popover.Content
            side="bottom"
            sideOffset={11}
            className="items-left z-50 flex flex-col gap-4 border border-valence-black bg-valence-white p-4 shadow-md transition-all"
          >
            <div className="items-left flex flex-col gap-3">
              <div className="flex flex-row justify-between items-start">
                <h1 className="text-base font-semibold">Wallet connected</h1>

                <div
                  className="h-6 w-6 bg-contain bg-center bg-no-repeat "
                  style={{
                    backgroundImage: `url(${walletInfo?.logo})`,
                  }}
                />
              </div>

              <div>
                <Label> {chain.pretty_name}</Label>
                <div className="max-w-48 text-balance break-words text-left font-mono text-xs">
                  {address}
                </div>
              </div>
            </div>

            <Button onClick={() => disconnect()} variant="secondary">
              Disconnect
            </Button>
          </Popover.Content>
        </Popover.Root>
      )}

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
