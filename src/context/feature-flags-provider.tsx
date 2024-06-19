"use client";
import { ErrorHandler } from "@/const/error";
import { FeatureFlags } from "@/const/feature-flags";
import { ReactNode, createContext, useContext } from "react";

const FeatureFlagsContext = createContext<{
  flags: Record<FeatureFlags, boolean>;
} | null>(null);

export const FeatureFlagsProvider: React.FC<{
  children: ReactNode;
  flags: Record<FeatureFlags, boolean>;
}> = ({ children, flags }) => {
  return (
    <FeatureFlagsContext.Provider value={{ flags }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

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
