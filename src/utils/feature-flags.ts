import { FeatureFlagsContext } from "@/context";
import { useContext } from "react";
import { ErrorHandler } from "@/const/error";

export enum FeatureFlags {
  REBALANCER_NONUSDC_VALUE = "REBALANCER_NONUSDC_VALUE",
  REBALANCER_CREATE = "REBALANCER_CREATE",
  COVENANTS_VIEW_POL = "COVENANTS_VIEW_POL",
}

export const getFeatureFlags = () => {
  const flags: Record<string, boolean> = {};
  Object.keys(FeatureFlags).forEach((key) => {
    const envVar = `FF_${key}`;
    flags[key] = process.env[envVar] === "true" ? true : false;
  });
  return flags;
};

// for server side
export const isFeatureFlagEnabled = (flag: FeatureFlags) => {
  const flags = getFeatureFlags();
  if (flag in flags) {
    return flags[flag];
  } else {
    throw new Error(`Unexpected feature flag ${flag}`);
  }
};

// for client side
export const useFeatureFlag = (flag: FeatureFlags) => {
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
  }
};
