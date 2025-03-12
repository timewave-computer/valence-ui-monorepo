"use client";
import {
  LiveBalancesTable,
  WithdrawDialog,
  PauseOrUnpauseButton,
  DepositDialog,
  DoneRebalancingTooltip,
  RebalanceInProgressTooltip,
  useAccountConfigQuery,
  useAssetMetadata,
  useLivePortfolio,
  useMultipleValenceAccounts,
  useRebalanceStatusQuery,
} from "@/app/rebalancer/ui";
import React, { useMemo, useState } from "react";
import { useWallet } from "@/hooks";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { displayMinBalance, displayPid } from "@/utils";
import {
  Button,
  WithIconAndTooltip,
  LoadingSkeleton,
  Label,
  Heading,
} from "@valence-ui/ui-components";
import Link from "next/link";
import { BsCheck, BsInfo } from "react-icons/bs";
import { useSearchParams } from "next/navigation";
import { useAccount } from "graz";

export const AccountDetailsPanel: React.FC<{}> = ({}) => {
  const searchParams = useSearchParams();
  const selectedAddress = searchParams.get("account") ?? "";
  const { data: config } = useAccountConfigQuery({
    account: selectedAddress,
  });

  const { getOriginAsset } = useAssetMetadata();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const configData: Array<{ title: string; content: string | number }> =
    useMemo(() => {
      const targets = config?.targets ?? [];
      const baseDenomAsset = getOriginAsset(config?.baseDenom ?? "");
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
                  const asset = getOriginAsset(targetWithMinBalance.denom);
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
    }, [config, getOriginAsset]);

  return (
    <div className="flex grow flex-col  overflow-x-auto border-valence-black bg-valence-white ">
      <AccountDetailsHeader selectedAddress={selectedAddress} />
      <section className="flex flex-col gap-2 border-b border-valence-black  p-4">
        <button
          className="flex flex-row justify-between items-center"
          onClick={() => {
            setIsConfigOpen(!isConfigOpen);
          }}
        >
          <Heading level="h3">Configuration</Heading>

          {isConfigOpen ? (
            <FaChevronDown className="h-4 w-4" />
          ) : (
            <FaChevronLeft className="h-4 w-4" />
          )}
        </button>

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
                    <h3 className="text-wrap text-xs font-semibold">
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
      <section className="flex w-full grow  flex-col pb-2 border-b border-valence-black ">
        <div>
          <Heading className="p-4 pb-2" level="h3">
            Live balances
          </Heading>
        </div>

        <div className="px-2">
          <LiveBalancesTable />
        </div>
      </section>
    </div>
  );
};

const AccountDetailsHeader: React.FC<{
  selectedAddress: string;
}> = ({ selectedAddress }) => {
  const { data: connectedAccount, isConnected: isWalletConnected } =
    useAccount();
  const walletAddress = connectedAccount?.bech32Address;

  const { data: allValenceAccounts } =
    useMultipleValenceAccounts(walletAddress);

  const isOwnAccount =
    isWalletConnected && allValenceAccounts?.includes(selectedAddress);

  const { data: config } = useAccountConfigQuery({
    account: selectedAddress,
  });

  const { data: livePortfolio } = useLivePortfolio({
    accountAddress: selectedAddress,
  });

  const { data: rebalanceStatus, isFetched: isRebalanceStatusFetched } =
    useRebalanceStatusQuery({
      accountAddress: selectedAddress,
    });

  return (
    <section className="flex flex-wrap items-center justify-between gap-4  border-y border-valence-black p-4">
      <div className="flex flex-col gap-1 ">
        <div className="flex flex-row items-center gap-1">
          {isOwnAccount ? (
            <Heading level="h2">Your Rebalancer Account</Heading>
          ) : (
            <Heading level="h2">Rebalancer Account</Heading>
          )}

          <div className="flex flex-row items-center gap-2">
            {config?.isPaused && <Label>Paused</Label>}
            {!config?.isPaused &&
              selectedAddress?.length > 0 &&
              !livePortfolio?.balances.every(
                (lineItem) => lineItem.balance.total === 0,
              ) && (
                <WithIconAndTooltip
                  isLoading={!isRebalanceStatusFetched}
                  variant="info"
                  Icon={rebalanceStatus?.isRebalanceComplete ? BsCheck : BsInfo}
                  tooltipContent={
                    rebalanceStatus?.isRebalanceComplete ? (
                      <DoneRebalancingTooltip address={selectedAddress ?? ""} />
                    ) : (
                      <RebalanceInProgressTooltip address={selectedAddress} />
                    )
                  }
                />
              )}
          </div>
        </div>
        {selectedAddress.length > 0 ? (
          <span className="font-mono text-xs">{selectedAddress}</span>
        ) : (
          <span className="text-xs text-valence-black">
            No account selected
          </span>
        )}
      </div>
      {isOwnAccount && (
        <div className="flex flex-row flex-nowrap gap-2 ">
          <WithdrawDialog />
          <DepositDialog />
          <PauseOrUnpauseButton />
          <Link href={`/rebalancer/edit/${selectedAddress}`}>
            <Button className="h-fit" variant="secondary">
              Edit
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};
