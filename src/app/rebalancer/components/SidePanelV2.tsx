"use client";
import { LinkText, TextInput, Label, ConnectWalletButton } from "@/components";
import { X_HANDLE, X_URL } from "@/const/socials";
import { useWallet } from "@/hooks";
import { cn, displayAddress, FeatureFlags, useFeatureFlag } from "@/utils";
import Image from "next/image";
import { accountAtom } from "@/app/rebalancer/const";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { DEFAULT_ACCOUNT, scaleAtom } from "@/app/rebalancer/const";
import { useAtom } from "jotai";
import { chainConfig } from "@/const/config";
import {
  useMultipleValenceAccounts,
  useValenceAccount,
} from "@/app/rebalancer/hooks";
import { ValenceProductBrand } from "@/components/ValenceProductBrand";

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
  rerouteOnConnect,
}) => {
  const [accountUrlParam, setAccountUrlParam] = useQueryState("account", {
    defaultValue: DEFAULT_ACCOUNT,
  });
  const [account, setAccount] = useAtom(accountAtom);
  useMemo(() => {
    setAccount(accountUrlParam);
  }, [setAccount, accountUrlParam]);

  const isConnectWalletEnabled = useFeatureFlag(FeatureFlags.REBALANCER_CREATE);

  // to track cursor when it moves
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    setCursorPosition &&
      setCursorPosition({ x: event.clientX, y: event.clientY });
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
              className="max-h-20 w-auto"
              src="/img/rebalancer.svg"
              alt="Rebalancer illustration"
              width={134}
              height={80}
            />
          }
        >
          <h1 className="text-xl font-bold">Rebalancer (beta)</h1>
          <p className="text-pretty pt-1">
            Automated balance sheet and treasury management. Contact{" "}
            <LinkText
              className=" font-medium text-valence-black hover:border-b-[1.6px] hover:border-valence-black"
              href={X_URL}
            >
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
          disabled={!isConnectWalletEnabled}
        />

        <div className="flex flex-col gap-2  ">
          <h1 className="font-bold">Search by address</h1>

          <TextInput
            input={account}
            onChange={(value) => setAccountUrlParam(value)}
            textClassName="font-mono"
            containerClassName="w-full"
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
      <h1 className="font-bold">Discover</h1>

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
                    <Label text="Your account" />
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
                <Label text="Featured" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
