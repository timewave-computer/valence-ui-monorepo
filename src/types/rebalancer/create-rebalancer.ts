import { TargetOverrideStrategy } from "@/types/rebalancer";

type AssetConfig = {
  denom: string;
  symbol: string;
  startingAmount?: number;
};

type TargetConfig = {
  denom: string;
  bps: number;
  minimumAmount?: number;
};

export type CreateRebalancerForm = {
  assets: AssetConfig[];
  baseTokenDenom: string;
  targets: TargetConfig[];
  pid: {
    p: string;
    i: string;
    d: string;
  };
  trustee?: string;
  targetOverrideStrategy: TargetOverrideStrategy;
  maxLimit?: number;
};
