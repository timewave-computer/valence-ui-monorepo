import { FeatureFlagsContext } from "@/context";
import { useContext } from "react";
import { ErrorHandler } from "@/const/error";

export enum FeatureFlags {
  AUCTIONS_LIVE_AGGREGATE = "NEXT_PUBLIC_FF_AUCTIONS_LIVE_AGGREGATE",
  AUCTIONS_OSMOSIS_PRICE = "NEXT_PUBLIC_FF_AUCTIONS_OSMOSIS_PRICE",
  REBALANCER_NONUSDC_VALUE = "NEXT_PUBLIC_FF_REBALANCER_NONUSDC_VALUE",
  REBALANCER_MULTIPLE_ACCOUNTS = "NEXT_PUBLIC_FF_ENABLE_MULTIPLE_ACCTS", // no intention to promote out of dev
  REBALANCE_PRICE_SOURCE_TOGGLE = "NEXT_PUBLIC_FF_REBALANCE_PRICE_SOURCE_TOGGLE", // no intention to promote out of preview
  COVENANTS_VIEW_POL = "NEXT_PUBLIC_FF_COVENANTS_VIEW_POL",
}

export const getFeatureFlags = () => {
  const flags: Record<string, boolean> = {};
  Object.values(FeatureFlags).forEach((value) => {
    const envVar = value;
    flags[value] = process.env[envVar] === "true" ? true : false;
  });
  return flags;
};

// for server side ONLY
export const isFeatureFlagEnabled = (flag: FeatureFlags) => {
  const flags = getFeatureFlags();
  if (flag in flags) {
    return flags[flag] === true;
  } else {
    throw new Error(`Unexpected feature flag ${flag}`);
  }
};

// for client side
export const useFeatureFlag = (flag: FeatureFlags): boolean => {
  const ctx = useContext(FeatureFlagsContext);
  if (!ctx) {
    throw new Error(
      "useFeatureFlag must be used within a FeatureFlagsProvider",
    );
  }
  const { flags } = ctx;
  if (flag in flags) {
    return flags[flag];
  } else {
    ErrorHandler.makeError(`Unexpected feature flag ${flag}`);
    return false;
  }
};
