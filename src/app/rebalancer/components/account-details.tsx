"use client";
import { Button, Label } from "@/components";
import { QUERY_KEYS } from "@/const/query-keys";
import { FetchAccountConfigReturnValue } from "@/server/actions";
import { cn, displayAddress } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";

import * as HoverCard from "@radix-ui/react-hover-card";
import { ReactNode, useState } from "react";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import { useChainContext } from "@/hooks";
import Link from "next/link";

export const AccountDetails: React.FC<{
  selectedAddress: string;
  isLoading: boolean;
}> = ({ selectedAddress, isLoading }) => {
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<FetchAccountConfigReturnValue>([
    QUERY_KEYS.REBALANCER_ACCOUNT_CONFIG,
    selectedAddress,
  ]);

  const { isWalletConnected } = useChainContext();

  if (isLoading)
    return (
      <AccountDetailsLayout>
        <div className="h-full w-full p-1">
          <LoadingSkeleton className="h-full  w-full" />
        </div>
      </AccountDetailsLayout>
    );
  // TODO: if wallet has valence address
  else if (!selectedAddress)
    return (
      <AccountDetailsLayout>
        <div className="p-4">
          {isWalletConnected ? (
            <div className="flex flex-col gap-2 ">
              <span className=" text-pretty">
                This wallet does not have a Rebalancer account.
              </span>
              <Link href={`/rebalancer/create/`}>
                <Button variant="primary">Start rebalancing funds</Button>
              </Link>
            </div>
          ) : (
            <>No account selected</>
          )}
        </div>
      </AccountDetailsLayout>
    );

  return (
    <AccountDetailsLayout>
      <div className="flex flex-col px-4">
        <div className="flex flex-row justify-between gap-2 py-4">
          <h3 className="text-sm font-bold">Address</h3>
          <p className="whitespace-normal  font-mono text-xs">
            <HoverToCopy
              textToCopy={selectedAddress}
              hoverContent={
                <div className="  max-w-48 text-balance break-all text-center">
                  {selectedAddress}
                </div>
              }
            >
              <span className="xs text-wrap break-all font-mono">
                {displayAddress(selectedAddress)}
              </span>
            </HoverToCopy>
          </p>
        </div>
        <div className="flex flex-row justify-between gap-2 py-4">
          <h3 className="text-sm font-bold">Owner</h3>
          <p className="whitespace-normal  font-mono text-xs">
            <HoverToCopy
              textToCopy={selectedAddress}
              hoverContent={
                <div className="  max-w-48 text-balance break-all text-center ">
                  {selectedAddress}
                </div>
              }
            >
              <span className="xs text-wrap break-all font-mono">
                {displayAddress(selectedAddress)}
              </span>
            </HoverToCopy>
          </p>
        </div>
        <div className="flex flex-row justify-between gap-2 py-4">
          <h3 className="text-sm font-bold">Rebalance Speed</h3>
          <p className="whitespace-normal text-wrap break-all font-mono text-xs">
            {Number(config?.pid?.p) * 100}%
          </p>
        </div>
      </div>
    </AccountDetailsLayout>
  );
};

const AccountDetailsLayout: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex h-full w-full flex-col">
      <h1 className="border-b border-valence-black p-4 text-base font-bold">
        Account details
      </h1>
      {children}
    </div>
  );
};

const HoverToCopy: React.FC<{
  textToCopy: string;
  children: ReactNode;
  hoverContent: ReactNode;
}> = ({ children, textToCopy, hoverContent }) => {
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

  return (
    <HoverCard.Root openDelay={0}>
      <HoverCard.Trigger
        onTouchMove={() => setIsCopying(false)}
        onClick={() => handleCopy(textToCopy)}
        asChild
      >
        {children}
      </HoverCard.Trigger>
      <HoverCard.Content
        side="top"
        {...(isCopying && { forceMount: true })}
        onClick={() => handleCopy(textToCopy)}
        className={cn(
          "z-50 flex flex-col items-center justify-center gap-2 border-[1px] border-valence-black bg-valence-white p-4 shadow-md",
        )}
      >
        {hoverContent}
        {isCopied ? <Label text="Copied" /> : <Label text="Click to copy" />}

        <HoverCard.Arrow />
      </HoverCard.Content>
    </HoverCard.Root>
  );
};
