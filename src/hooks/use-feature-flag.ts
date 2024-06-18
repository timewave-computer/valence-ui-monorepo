import { FeatureFlags } from "@/const/flags";
import { getFeatureFlag } from "@/server/feature-flags";
import { useState, useEffect } from "react";

export const useFeatureFlag = (key: FeatureFlags) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const isEnabled = await getFeatureFlag(key);
      setEnabled(isEnabled);
    })();
  }, []);
  return enabled;
};
