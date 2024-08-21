import { FeatureFlags, isFeatureFlagEnabled } from "@/utils";
import { AccountDetailsPanel, SidePanelV2, Table } from "./components";
import { HistoricalGraph } from "./create/components/HistoricalGraph";
import { SidePanelV1 } from "./RebalancerMain";

export default function LoadingRebalancerMain() {
  const enabled = isFeatureFlagEnabled(FeatureFlags.REBALANCER_CREATE);

  if (enabled)
    return (
      <div className=" flex w-full flex-row">
        <SidePanelV2 />
        <div className="flex min-w-[824px] grow  flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
          <HistoricalGraph isLoading={true} isError={false} />
          <AccountDetailsPanel selectedAddress="" />
        </div>
      </div>
    );
  else
    return (
      <div className=" flex w-full flex-row">
        <SidePanelV1
          isLoading={true}
          isValidAccount={false}
          isDisabled={true}
        />
        <div className="flex min-w-[824px] grow  flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
          <HistoricalGraph isLoading={true} isError={false} />
          <Table
            isLoading={true}
            livePortfolio={{
              balances: [],
              totalValue: 0,
            }}
            targets={[]}
          />
        </div>
      </div>
    );
}
