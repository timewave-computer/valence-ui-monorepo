"use client";
import { ConnectWalletButton, ValenceProductBrand } from "@/components";
import { X_HANDLE, X_URL } from "@valence-ui/socials";
import { useWallet } from "@/hooks";
import { cn, displayAddress, FeatureFlags, useFeatureFlag } from "@/utils";
import Image from "next/image";
import {
  scaleAtom,
  accountAtom,
  useMultipleValenceAccounts,
  useValenceAccount,
} from "@/app/rebalancer/ui";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useAtom } from "jotai";
import { chainConfig } from "@/const/config";
import {
  Label,
  TextInput,
  LinkText,
  InputLabel,
  Heading,
} from "@valence-ui/ui-components";

export const SidePanelV2: React.FC<{
  rerouteOnConnect?: boolean;
  showConnectWallet?: boolean;
  debouncedMouseEnter?: () => void;
  debouncedMouseLeave?: () => void;
  setCursorPosition?: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}> = ({
  debouncedMouseEnter,
  debouncedMouseLeave,
  setCursorPosition,
  rerouteOnConnect = true,
}) => {
  const [accountUrlParam] = useQueryState("account", {
    defaultValue: "",
  });
  const [_, setAccount] = useAtom(accountAtom);
  useMemo(() => {
    setAccount(accountUrlParam);
  }, [setAccount, accountUrlParam]);

  // to track cursor when it moves
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    setCursorPosition &&
      setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  const router = useRouter();
  const [scale] = useAtom(scaleAtom);

  const handleSearchByAddress = (address: string) => {
    router.push(`/rebalancer?account=${address}&scale=${scale}`);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="flex w-96 shrink-0 flex-col overflow-hidden overflow-y-auto border-r border-valence-black"
    >
      <div className=" flex flex-col items-stretch gap-4 border-b   border-valence-black p-4">
        <ValenceProductBrand
          img={
            <Image
              priority={true}
              className="max-h-20 w-auto"
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              width={134}
              height={80}
            />
          }
        >
          <Heading level="h4">Rebalancer (beta)</Heading>
          <p className="text-pretty pt-1">
            Automated balance sheet and treasury management. Contact{" "}
            <LinkText variant="primary" blankTarget={true} href={X_URL}>
              {X_HANDLE}
            </LinkText>{" "}
            for support.
          </p>
        </ValenceProductBrand>
        <ConnectWalletButton
          rerouteOnConnect={rerouteOnConnect}
          connectCta="Connect your wallet to start rebalancing funds."
          debouncedMouseEnter={debouncedMouseEnter}
          debouncedMouseLeave={debouncedMouseLeave}
        />

        <div className="flex flex-col ">
          <InputLabel label="Search by address" />

          <TextInput
            value={accountUrlParam}
            onChange={(e) => handleSearchByAddress(e.target.value)}
            placeholder="neutron12345..."
          />
        </div>
      </div>

      <DiscoverPanel />
    </div>
  );
};

const DiscoverPanel: React.FC<{}> = ({}) => {
  const [account] = useAtom(accountAtom);

  const { address, isWalletConnected } = useWallet();
  const { data: valenceAddress } = useValenceAccount(address);
  const { data: allValenceAccounts } = useMultipleValenceAccounts(address);
  let featuredAccounts = chainConfig.featuredAccounts;

  const router = useRouter();
  const [scale] = useAtom(scaleAtom);

  const isMultipleValenceAccountsEnabled = useFeatureFlag(
    FeatureFlags.REBALANCER_MULTIPLE_ACCOUNTS,
  );

  return (
    <div className="flex flex-col  items-stretch gap-2  p-4">
      <InputLabel noGap label="Discover" />

      <div>
        {featuredAccounts.length === 0 && (
          <p className="py-2 text-sm">
            No featured accounts to show for {chainConfig.chain.pretty_name}.
          </p>
        )}
        {isWalletConnected &&
          (isMultipleValenceAccountsEnabled ? (
            <button
              key={`discover-${valenceAddress}`}
              onClick={() => {
                router.push(`/rebalancer/create`);
              }}
              className={cn(
                "w-full border-l border-r border-t border-valence-gray transition-all",
                "flex flex-col gap-0.5  bg-valence-white px-3 py-3",

                account !== valenceAddress &&
                  "hover:bg-valence-lightgray hover:text-valence-black",
              )}
            >
              <span className="flex flex-row justify-between gap-2 ">
                <span className="text-left">Create new account</span>
              </span>
            </button>
          ) : (
            <button
              key={`discover-${valenceAddress}`}
              onClick={() => {
                if (valenceAddress)
                  router.push(
                    `/rebalancer?account=${valenceAddress}&scale=${scale}`,
                  );
                else router.push(`/rebalancer/`);
              }}
              className={cn(
                "w-full border-l border-r border-t border-valence-gray transition-all",

                "flex flex-col gap-0.5  bg-valence-white px-3 py-3",
                (account === valenceAddress || (!account && !valenceAddress)) &&
                  "bg-valence-black text-valence-white",
                account !== valenceAddress &&
                  "hover:bg-valence-lightgray hover:text-valence-black",
              )}
            >
              <span className="flex flex-row justify-between gap-2 ">
                <span className="text-left">Your account</span>
              </span>
            </button>
          ))}

        {isMultipleValenceAccountsEnabled && !!allValenceAccounts?.length && (
          <>
            {allValenceAccounts.map((a) => {
              return (
                <button
                  key={`wallet-accts-${a}`}
                  onClick={() => {
                    router.push(`/rebalancer?account=${a}&scale=${scale}`);
                  }}
                  className={cn(
                    "w-full border-l border-r border-t border-valence-gray transition-all",
                    "flex flex-col gap-0.5  bg-valence-white px-3 py-3",
                    account === a && "bg-valence-black text-valence-white",
                    account !== a && "hover:bg-valence-lightgray",
                  )}
                >
                  <span className="flex w-full flex-row justify-between gap-2 ">
                    <span className="text-left">{displayAddress(a)}</span>
                    <Label>Your account</Label>
                  </span>
                </button>
              );
            })}
          </>
        )}

        {featuredAccounts.map((option, i) => {
          const isLastElement = i === featuredAccounts.length - 1;

          return (
            <button
              key={`discover-${option.value}`}
              onClick={() => {
                router.push(
                  `/rebalancer?account=${option.value}&scale=${scale}`,
                );
              }}
              className={cn(
                "w-full border-l border-r border-t border-valence-gray transition-all",
                isLastElement && "border-b",
                "flex flex-col gap-0.5  bg-valence-white px-3 py-3",
                account === option.value &&
                  "bg-valence-black text-valence-white",
                account !== option.value && "hover:bg-valence-lightgray",
              )}
            >
              <span className="flex w-full flex-row justify-between gap-2 ">
                <span className="text-left">{option.label}</span>
                <Label>Featured</Label>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
