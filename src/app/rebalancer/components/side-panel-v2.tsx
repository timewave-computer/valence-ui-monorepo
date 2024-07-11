import { Button, LinkText, TextInput, Label } from "@/components";
import { QUERY_KEYS } from "@/const/query-keys";
import { X_HANDLE, X_URL } from "@/const/socials";
import { useEdgeConfig, useWallet } from "@/hooks";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { cn, displayAddress } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { DEFAULT_FEATURED_ACCOUNTS } from "@/app/rebalancer/const";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SidePanelV2: React.FC<{
  account: string;
  setAccount: (s: string) => void;
  isLoading: boolean;
}> = ({ account, setAccount, isLoading }) => {
  return (
    <div className="flex w-96 shrink-0 flex-col overflow-hidden overflow-y-auto border-r border-valence-black">
      <Brand account={account} setAccount={setAccount} />
      {!!account && account.length && (
        <AccountDetails isLoading={isLoading} account={account} />
      )}
      <DiscoverPanel account={account} setAccount={setAccount} />
    </div>
  );
};

const Brand: React.FC<{
  account: string;
  setAccount: (s: string) => void;
}> = ({ account, setAccount }) => {
  const { connect, isConnected, disconnect, isConnecting, address } =
    useWallet();

  return (
    <div className=" flex flex-col items-stretch gap-4 border-b   border-valence-black p-4">
      <div className="flex flex-row  items-center gap-4 border-valence-black">
        <Image
          className="max-h-20 w-auto"
          src="/img/rebalancer.svg"
          alt="Rebalancer illustration"
          width={134}
          height={80}
        />
        <div className="">
          <h1 className="text-xl font-bold">Rebalancer (beta)</h1>
          <p className="text-pretty pt-1">
            Automated balance sheet and treasury management. Contact{" "}
            <LinkText
              className=" text-valence-black hover:border-b-[1.6px] hover:border-valence-black"
              href={X_URL}
            >
              {X_HANDLE}
            </LinkText>{" "}
            for support.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {isConnecting && <Button variant="secondary">Connecting</Button>}
        {!isConnected && (
          <>
            <Button
              onClick={async () => {
                await connect();
              }}
              variant="primary"
            >
              {" "}
              Connect Wallet
            </Button>
            <p className="text-center text-sm">
              Connect your wallet to start rebalancing funds.
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2  ">
        <h1 className="font-bold">Search by address</h1>

        <TextInput
          input={account}
          onChange={(value) => setAccount(value)}
          textClassName="font-mono"
          containerClassName="w-full"
          placeholder="neutron12345..."
        />
      </div>
    </div>
  );
};

const AccountDetails: React.FC<{ account: string; isLoading: boolean }> = ({
  account,
  isLoading,
}) => {
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<FetchAccountConfigReturnValue>([
    QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG,
    account,
  ]);

  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = (account: string) => {
    setIsCopying(true);
    setIsCopied(true);
    navigator.clipboard.writeText(account);
    setTimeout(() => {
      setIsCopied(false);
      setIsCopying(false);
    }, 1000);
  };

  if (isLoading)
    return (
      <div className="h-[160px] border-b  border-valence-black p-4">
        <div className="h-full w-full animate-pulse bg-valence-lightgray" />
      </div>
    );
  return (
    <div className="flex flex-col  items-stretch gap-2 border-b border-valence-black p-4">
      <div className="flex items-center justify-between">
        {" "}
        <h1 className="font-bold">Rebalancer account</h1>
        <HoverCard.Root openDelay={0}>
          <HoverCard.Trigger
            onTouchMove={() => setIsCopying(false)}
            onClick={() => handleCopy(account)}
            asChild
          >
            <span className="font-mono text-sm font-bold">
              {displayAddress(account)}
            </span>
          </HoverCard.Trigger>
          <HoverCard.Content
            {...(isCopying && { forceMount: true })}
            onClick={() => handleCopy(account)}
            className="z-50 flex flex-col items-center gap-2 border-[1px] border-valence-black bg-valence-white p-4 shadow-md"
          >
            <span className="font-mono text-sm font-medium tracking-wide">
              {account}
            </span>
            {isCopied ? (
              <Label text="Copied" />
            ) : (
              <Label text="Click to copy" />
            )}

            <HoverCard.Arrow />
          </HoverCard.Content>
        </HoverCard.Root>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between ">
          <span className="text-sm font-medium">Owner</span>
          <span className=" text-sm font-light">not implemented</span>
        </div>
        <div className="items-top flex justify-between text-sm ">
          <span className="text-sm font-medium">Targets</span>
          <div className="flex flex-col">
            {config?.targets.map((target) => (
              <span
                key={`details-target-${target.asset.symbol}`}
                className=" text-sm font-light"
              >
                {target.percentage * 100}% {target.asset.symbol}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-sm font-medium">Rebalance Speed</span>
          <span className=" text-sm font-light">
            {Number(config?.pid?.p) * 100}%
          </span>
        </div>
      </div>
    </div>
  );
};

const DiscoverPanel: React.FC<{
  account: string;
  setAccount: (s: string) => void;
}> = ({ account, setAccount }) => {
  const { data: edgeConfig } = useEdgeConfig();
  const { isConnected } = useWallet();
  const featuredAccounts =
    edgeConfig?.featured_rebalancer_accounts ?? DEFAULT_FEATURED_ACCOUNTS;

  const router = useRouter();

  return (
    <div className="flex flex-col  items-stretch gap-2 border-b border-valence-black p-4">
      <h1 className="font-bold">Discover</h1>
      {isConnected && (
        <div
          onClick={() => {}}
          className={cn(
            " border border-valence-black transition-all",
            "flex flex-col gap-0.5  bg-valence-white px-3 py-3",
          )}
        >
          <div className="flex flex-col gap-2 ">
            <span className=" text-pretty">
              No rebalancer found for this wallet.
            </span>
            <Button
              onClick={() => {
                router.push("/rebalancer/create");
              }}
              className="w-fit"
              variant="primary"
            >
              Start rebalancing funds
            </Button>
          </div>
        </div>
      )}
      <div>
        {featuredAccounts.map((option, i) => {
          const isLastElement = i === featuredAccounts.length - 1;

          return (
            <div
              key={`discover-${option.value}`}
              onClick={() => {
                setAccount(option.value);
              }}
              className={cn(
                "border-l border-r border-t border-valence-black transition-all",
                isLastElement && "border-b",
                "flex flex-col gap-0.5  bg-valence-white px-3 py-3",
                account === option.value &&
                  "bg-valence-black text-valence-white",
                account !== option.value && "hover:bg-valence-lightgray",
              )}
            >
              <div className="flex flex-row justify-between gap-2 ">
                <span className=" text-pretty">{option.label}</span>

                <Label text="Featured" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
