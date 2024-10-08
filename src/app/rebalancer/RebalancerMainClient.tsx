"use client";
import { useMemo } from "react";
import {
  SidePanelV2,
  AccountDetailsPanel,
  HistoricalGraph,
} from "@/app/rebalancer/components";
import {
  useAccountConfigQuery,
  useHistoricValues,
} from "@/app/rebalancer/hooks";

export const RebalancerMainClient = ({ account }: { account?: string }) => {
  const accountConfigQuery = useAccountConfigQuery({
    account: account ?? "",
  });
  const targets = useMemo(
    () => accountConfigQuery.data?.targets ?? [],
    [accountConfigQuery.data?.targets],
  );
  const historicValuesQuery = useHistoricValues({
    accountAddress: account ?? "",
    targets,
  });

  return (
    <div className="flex grow flex-row overflow-hidden">
      <SidePanelV2 />
      <div className="flex min-w-[824px] grow flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
        <HistoricalGraph
          isLoading={
            accountConfigQuery.isLoading || historicValuesQuery.isLoading
          }
          isError={accountConfigQuery.isError || historicValuesQuery.isError}
        />

        <AccountDetailsPanel />
      </div>
    </div>
  );
};
