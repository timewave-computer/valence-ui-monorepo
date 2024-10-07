import { LoadingSkeleton } from "@/components";
import { SidePanelV2 } from "../../components/";

export default function LoadingEditRebalancer() {
  return (
    <div className=" flex w-full flex-row">
      <SidePanelV2 showConnectWallet={false} rerouteOnConnect={false} />
      <div className="flex min-w-[824px] grow animate-pulse flex-col overflow-clip overflow-y-auto bg-valence-lightgray text-sm">
        <LoadingSkeleton className="min-h-screen" />
      </div>
    </div>
  );
}
