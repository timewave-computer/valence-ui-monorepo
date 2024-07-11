import { FeatureFlags, isFeatureFlagEnabled } from "@/utils";
import { redirect } from "next/navigation";

const CreateRebalancer = () => {
  const enabled = isFeatureFlagEnabled(FeatureFlags.REBALANCER_CREATE);

  if (!enabled) {
    redirect("/rebalancer");
  }

  return (
    <div>
      <h1>Create Rebalancer</h1>
    </div>
  );
};

export default CreateRebalancer;
