import { CreateRebalancerForm } from "@/types/rebalancer";

type Target = CreateRebalancerForm["targets"][number];
// Type guard function

export function hasDenom(target: Target): target is Target & { denom: string } {
  return !!target.denom;
}
