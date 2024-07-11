"use client";
import { FeatureFlags } from "@/utils";
import { ReactNode, createContext } from "react";

export const FeatureFlagsContext = createContext<{
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
