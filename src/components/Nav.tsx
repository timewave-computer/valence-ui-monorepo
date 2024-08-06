"use client";
import { cn, displayAddress } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdMenu } from "react-icons/io";
import { Button } from "./Button";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import { useChainContext, useSupportedBalances, useWallet } from "@/hooks";
import * as Popover from "@radix-ui/react-popover";
import { useValenceAccount } from "@/app/rebalancer/hooks";

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

export const Nav = () => {
  const path = usePathname();
  const { chain } = useChainContext();
  const { address, disconnect, isWalletConnected } = useWallet();

  // TODO: hydrate this on server so we dont have to call it unless user decides to click 'create'
  useSupportedBalances(address);

  const links = (
    <>
      <NavLink href="/covenants" label="Covenants" path={path} />
      <NavLink href="/rebalancer" label="Rebalancer" path={path} />
      <NavLink href="/blog" label="Blog" path={path} />
    </>
  );

  return (
    <nav
      className={cn(
        "flex min-h-[3.25rem] flex-row items-center justify-between border-b border-valence-black bg-valence-white px-4 text-valence-black",
        path === "/" && "flex md:hidden",
      )}
    >
      <div className="flex items-center gap-2 md:gap-8">
        <a className="" href="/">
          <Image
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
            <div
              className={cn(
                "valence-border-black border-[1px] border-valence-black px-1.5 py-1 font-mono text-sm",
                "hidden md:flex", // hide on mobile
              )}
            >
              {displayAddress(address)}
            </div>
          </Popover.Trigger>

          <Popover.Content
            sideOffset={0}
            className="z-50 flex flex-col items-center gap-4 border border-valence-black bg-valence-white p-4 shadow-md transition-all"
          >
            <Popover.Arrow />
            <div className="flex flex-col items-center gap-1">
              <span className="h-fit bg-valence-mediumgray px-1.5 py-0.5 text-xs text-valence-black ">
                {chain.chain_id}
              </span>
              <span className="w-fit max-w-32 break-words text-center font-mono text-xs font-light tracking-tight">
                {address}
              </span>
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
              className="transform border-none  transition-transform active:scale-90
               "
            >
              <IoMdMenu className="h-6 w-6 " />
            </Button>
          </SheetTrigger>

          <SheetContent>
            <div className=" flex flex-col gap-8 p-4 text-xl">
              {/* special case for mobile */}
              <NavLink href="/" label="Home" path={path} />
              {links}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
