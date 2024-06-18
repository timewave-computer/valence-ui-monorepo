"use server";
import { FeatureFlags } from "@/const/flags";
import { unstable_flag as flag } from "@vercel/flags/next";

// for metadata and description see src/app/.well-known/vercel/flags/route.ts
// They are boolean values saved as strings, so make sure to handle string -> boolean interpretation appropriately

export const getFeatureFlag = (key: FeatureFlags) => {
  const envVar = `FF_${key}`;
  const featureFlag = flag({
    key: key,
    decide: () => (process.env[envVar] === "true" ? true : false),
  });
  return featureFlag();
};
