import {
  AccountDetailsPanel,
  SidePanelV2,
  HistoricalGraph,
} from "@/app/rebalancer/components";

export default function RebalancerMainSuspenseFallback() {
  return (
    <div className=" flex w-full flex-row">
      <SidePanelV2 />
      <div className="flex min-w-[824px] grow  flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
        <HistoricalGraph isLoading={true} isError={false} />
        <AccountDetailsPanel selectedAddress="" />
      </div>
    </div>
  );
}
