import { TargetOverrideStrategy } from "@/types/rebalancer";

type AssetConfig = {
  denom?: string;

  startingAmount: number;
};

type TargetConfig = {
  targetDenom: string;
  targetAmount: number;
  minimumAmount?: number;
};

export type CreateRebalancerForm = {
  assets: AssetConfig[];
  baseTokenDenom: string;
  targets: TargetConfig[];
  pid: {
    p: number;
    i: number;
    d: number;
  };
  trustee?: string;
  targetOverrideStrategy: TargetOverrideStrategy;
  maxLimit?: number;
};
