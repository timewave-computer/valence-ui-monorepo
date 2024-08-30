"use client";
import { ComingSoonTooltipContent } from "@/components";
import { useMemo, useState } from "react";
import {
  SidePanelV2,
  AccountDetailsPanel,
  HistoricalGraph,
} from "@/app/rebalancer/components";
import {
  useAccountConfigQuery,
  useHistoricValues,
  useLivePortfolio,
} from "@/app/rebalancer/hooks";
import { LOAD_CONFIG_ERROR, accountAtom } from "@/app/rebalancer/const";
import { cn, FeatureFlags, useFeatureFlag } from "@/utils";
import { useAtom } from "jotai";

export const RebalancerMainClient = () => {
  const [account] = useAtom(accountAtom);
  const accountConfigQuery = useAccountConfigQuery({
    account: account,
  });
  const targets = useMemo(
    () => accountConfigQuery.data?.targets ?? [],
    [accountConfigQuery.data?.targets],
  );
  const historicValuesQuery = useHistoricValues({
    accountAddress: account,
    targets,
  });

  // used to track when hovering over scrollable side panel
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const [isDisabledElementHovered, setIsDisabledElementHovered] =
    useState(false);
  const [delayHandler, setDelayHandler] = useState<number | null>(null); // hack to keep tooltip open when moving mouse towards it
  const debouncedMouseEnter = () => {
    setIsDisabledElementHovered(true);
    if (delayHandler !== null) clearTimeout(delayHandler);
  };
  const debouncedMouseLeave = () => {
    setDelayHandler(
      window.setTimeout(() => {
        setIsDisabledElementHovered(false);
      }, 100),
    );
  };

  const isConnectWalletEnabled = useFeatureFlag(FeatureFlags.REBALANCER_CREATE);

  return (
    <div className="flex grow flex-row overflow-hidden">
      {isDisabledElementHovered && !isConnectWalletEnabled && (
        <div
          onMouseEnter={debouncedMouseEnter}
          onMouseLeave={debouncedMouseLeave}
          style={{
            top: `${cursorPosition.y - 88}px`, // assign height of tooltip dynamically
          }}
          className={cn(
            "absolute left-[392px] z-50 flex w-64 grow border-[0.5px]",
            "animate-in  fade-in-0 zoom-in-95 border-valence-black bg-valence-white p-4 drop-shadow-md",
          )}
        >
          <ComingSoonTooltipContent />
        </div>
      )}
      <SidePanelV2
        rerouteOnConnect={true}
        setCursorPosition={setCursorPosition}
        debouncedMouseEnter={debouncedMouseEnter}
        debouncedMouseLeave={debouncedMouseLeave}
      />
      <div className="flex min-w-[824px] grow flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
        <HistoricalGraph
          isLoading={
            accountConfigQuery.isLoading || historicValuesQuery.isLoading
          }
          isError={accountConfigQuery.isError || historicValuesQuery.isError}
        />

        <AccountDetailsPanel selectedAddress={account} />
      </div>
    </div>
  );
};
