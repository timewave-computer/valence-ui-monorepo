"use client";
import { TableV2, AccountActions } from "@/app/rebalancer/components";
import {
  useAccountConfigQuery,
  useAssetCache,
  useLivePortfolio,
  useValenceAccount,
} from "@/app/rebalancer/hooks";
import React, { useMemo, useState } from "react";
import { useWallet } from "@/hooks";
import { IconButton, Label } from "@/components";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { displayMinBalance, displayPid } from "@/utils";
import { Button } from "@/components";
import Link from "next/link";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export const AccountBottomPanel: React.FC<{
  selectedAddress: string;
}> = ({ selectedAddress }) => {
  const isHasAccountInput = !!selectedAddress && selectedAddress !== "";
  const { data: config } = useAccountConfigQuery({
    account: selectedAddress,
    enabled: isHasAccountInput,
  });

  const targets = config?.targets ?? [];

  const livePortfolioQuery = useLivePortfolio({
    rebalancerAddress: selectedAddress,
    targetDenoms: targets.map((target) => target.denom),
  });

  const { getAsset } = useAssetCache();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const configData: Array<{ title: string; content: string | number }> =
    useMemo(() => {
      const baseDenomAsset = getAsset(config?.baseDenom ?? "");
      const targetWithMinBalance = targets.find((t) => !!t.min_balance);

      if (!config) return [];
      return [
        {
          title: "Creator",
          content: config.admin,
        },
        {
          title: "Base denomination",
          content: baseDenomAsset?.symbol ?? "",
        },
        {
          title: "Rebalance speed",
          content: displayPid(config.pid),
        },

        ...(targetWithMinBalance
          ? [
              {
                title: "Minimum balance",
                content: (() => {
                  const asset = getAsset(targetWithMinBalance.denom);
                  return displayMinBalance(
                    targetWithMinBalance.min_balance ?? 0,
                    asset?.symbol ?? "",
                    asset?.decimals ?? 0,
                  );
                })(),
              },
            ]
          : []),
        {
          title: "Strategy",
          content: config.targetOverrideStrategy,
        },
        ...(config.maxLimit
          ? [
              {
                title: "Maximum limit",
                content: `${config.maxLimit * 100}%`,
              },
            ]
          : []),
        ...(config.trustee
          ? [
              {
                title: "Truee",
                content: config.trustee,
              },
            ]
          : []),
      ];
    }, [config, getAsset]);

  return (
    <div className="flex grow flex-col  overflow-x-auto border-valence-black bg-valence-white ">
      <TopBar selectedAddress={selectedAddress} />
      <section className="flex flex-col gap-2 border-b border-valence-black  p-4">
        <div
          className="flex flex-row justify-between"
          onClick={() => {
            setIsConfigOpen(!isConfigOpen);
          }}
        >
          <div className="flex flex-row items-center gap-2">
            <h2 className="text-sm font-bold">Configuration</h2>

            {config?.isPaused && <Label text="PAUSED" />}
          </div>
          <IconButton
            className="h-4 w-4"
            Icon={isConfigOpen ? FaChevronLeft : FaChevronDown}
            onClick={() => {
              setIsConfigOpen(!isConfigOpen);
            }}
          />
        </div>

        {isConfigOpen && (
          <>
            {selectedAddress.length === 0 && (
              <span className="text-xs text-valence-black">
                No account selected
              </span>
            )}
            {configData.length > 0 && (
              <div className="flex flex-col gap-2">
                {configData.map((data, index) => (
                  <div
                    key={index}
                    className="no-wrap flex flex-row items-center gap-2"
                  >
                    <h3 className="text-wrap text-xs font-bold">
                      {data.title}
                    </h3>
                    <p className="whitespace-normal  font-mono text-xs">
                      {data.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
      <section className="flex w-full grow  flex-col gap-4 px-4">
        <h2 className="pt-4 text-sm font-bold">Live balances</h2>
        <TableV2
          targets={targets}
          isLoading={livePortfolioQuery.isLoading || !livePortfolioQuery.data}
          livePortfolio={livePortfolioQuery.data}
        />
      </section>
    </div>
  );
};

const TopBar: React.FC<{
  selectedAddress: string;
}> = ({ selectedAddress }) => {
  const isHasAccountInput = !!selectedAddress && selectedAddress !== "";
  const { data: config } = useAccountConfigQuery({
    account: selectedAddress,
    enabled: isHasAccountInput,
  });

  const {
    isWalletConnected,
    isWalletConnecting,
    address: walletAddress,
  } = useWallet();
  const { data: valenceAccountAddress, isLoading: isLoadingValenceAccount } =
    useValenceAccount(walletAddress);
  const hasValenceAccount = !!valenceAccountAddress;
  const isOwnAccount =
    (isWalletConnected && config?.admin === walletAddress) ||
    (!hasValenceAccount && selectedAddress === "");

  if (isWalletConnecting || isLoadingValenceAccount) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-4  border-y border-valence-black p-4">
        <LoadingSkeleton className="min-h-16 w-full" />
      </section>
    );
  }

  if (!isWalletConnected || !isOwnAccount) {
    return (
      <section className="flex flex-wrap items-center justify-between gap-4  border-y border-valence-black p-4">
        <div className="flex flex-col gap-1 ">
          <h1 className="text-base font-bold">Rebalancer Account</h1>
          {selectedAddress.length > 0 && (
            <span className="font-mono">{selectedAddress}</span>
          )}
        </div>
      </section>
    );
  }

  // is own account
  return (
    <section className="flex flex-wrap items-center justify-between gap-4  border-y border-valence-black p-4">
      <div className="flex flex-col gap-1 ">
        <h1 className="text-base font-bold">Your Rebalancer Account</h1>
        {selectedAddress.length === 0 && !hasValenceAccount && (
          <p className="text-xs">
            This wallet does not have a Rebalancer account
          </p>
        )}
        {selectedAddress.length > 0 && (
          <span className="font-mono">{selectedAddress}</span>
        )}
      </div>
      {hasValenceAccount ? (
        <AccountActions
          valenceAccountAddress={valenceAccountAddress}
          config={config}
        />
      ) : (
        <Link href={`/rebalancer/create`}>
          <Button variant="primary">Start rebalancing funds</Button>
        </Link>
      )}
    </section>
  );
};
