"use client";
import { ComingSoonTooltipContent } from "@/components";
import { useMemo, useState } from "react";
import {
  Table,
  SidePanel,
  SidePanelV2,
  AccountDetailsPanel,
} from "@/app/rebalancer/components";
import {
  useAccountConfigQuery,
  useHistoricValues,
  useLivePortfolio,
} from "@/app/rebalancer/hooks";
import { LOAD_CONFIG_ERROR, accountAtom } from "@/app/rebalancer/const";
import { StatusBar } from "@/components/StatusBar";
import { FiAlertTriangle } from "react-icons/fi";
import { LinkText } from "@/components";
import Image from "next/image";
import { X_HANDLE, X_URL } from "@/const/socials";
import { FeatureFlags, useFeatureFlag } from "@/utils";
import { cn } from "@/utils";
import { useAtom } from "jotai";
import { HistoricalGraph } from "./create/components/HistoricalGraph";

export const RebalancerMain = () => {
  const [account] = useAtom(accountAtom);

  const isHasAccountInput = !!account && account !== "";
  const accountConfigQuery = useAccountConfigQuery({
    account: account,
  });

  const isValidAccount =
    isHasAccountInput &&
    accountConfigQuery.error !== LOAD_CONFIG_ERROR.INVALID_ACCOUNT;

  const targets = useMemo(
    () => accountConfigQuery.data?.targets ?? [],
    [accountConfigQuery.data?.targets],
  );

  const livePortfolioQuery = useLivePortfolio({
    accountAddress: account,
  });

  const historicValuesQuery = useHistoricValues({
    accountAddress: account,
    targets,
  });

  const isCreateRebalancerEnabled = useFeatureFlag(
    FeatureFlags.REBALANCER_CREATE,
  );

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

  return (
    <div className="flex grow flex-row overflow-hidden">
      {isDisabledElementHovered && (
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

      {isCreateRebalancerEnabled ? (
        <SidePanelV2 />
      ) : (
        <SidePanelV1
          setCursorPosition={setCursorPosition}
          setIsDisabledElementHovered={setIsDisabledElementHovered}
          isLoading={accountConfigQuery.isLoading}
          isValidAccount={isValidAccount}
        />
      )}
      <div className="flex min-w-[824px] grow flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
        <HistoricalGraph
          isLoading={
            accountConfigQuery.isLoading || historicValuesQuery.isLoading
          }
          isError={accountConfigQuery.isError || historicValuesQuery.isError}
        />
        {isCreateRebalancerEnabled ? (
          <AccountDetailsPanel selectedAddress={account} />
        ) : (
          <div className="grow overflow-x-auto bg-valence-white">
            <Table
              isLoading={livePortfolioQuery.isLoading}
              livePortfolio={livePortfolioQuery.data}
              targets={targets}
            />
            {livePortfolioQuery.isError &&
              !accountConfigQuery.isError &&
              !historicValuesQuery.isError &&
              !historicValuesQuery.isLoading && (
                <StatusBar
                  className="border-0"
                  variant="error"
                  text="Could not load live portfolio"
                  icon={<FiAlertTriangle />}
                />
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export const SidePanelV1 = ({
  isLoading,
  isValidAccount,
  setCursorPosition,
  setIsDisabledElementHovered,
  isDisabled = false,
}: {
  isLoading: boolean;
  isDisabled?: boolean;
  isValidAccount: boolean;
  setIsDisabledElementHovered?: React.Dispatch<React.SetStateAction<boolean>>;
  setCursorPosition?: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}) => {
  const [delayHandler, setDelayHandler] = useState<number | null>(null); // hack to keep tooltip open when moving mouse towards it
  const debouncedMouseEnter = () => {
    setIsDisabledElementHovered && setIsDisabledElementHovered(true);
    if (delayHandler !== null) clearTimeout(delayHandler);
  };
  const debouncedMouseLeave = () => {
    setDelayHandler(
      window.setTimeout(() => {
        setIsDisabledElementHovered && setIsDisabledElementHovered(false);
      }, 100),
    );
  };

  // to track cursor when it moves
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    setCursorPosition &&
      setCursorPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className="flex w-96 shrink-0 flex-col items-stretch overflow-hidden overflow-y-auto border-r border-valence-black"
    >
      <div className="flex flex-col gap-2 border-valence-black px-4">
        <Image
          className="mb-6 mt-8"
          src="/img/rebalancer.svg"
          alt="Rebalancer illustration"
          width={236}
          height={140}
        />
        <h1 className="text-xl font-bold">Rebalancer (beta)</h1>
        <p>
          Contact{" "}
          <LinkText
            className="border-valence-black text-valence-black hover:border-b"
            href={X_URL}
          >
            {X_HANDLE}
          </LinkText>{" "}
          if you or your DAO want early access to the Rebalancer.
        </p>
      </div>

      <SidePanel
        isDisabled={isDisabled}
        isValidAccount={isValidAccount}
        isLoading={isLoading}
        debouncedMouseEnter={debouncedMouseEnter}
        debouncedMouseLeave={debouncedMouseLeave}
      />
    </div>
  );
};
