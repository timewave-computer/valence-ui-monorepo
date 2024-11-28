import { useWhitelistedDenoms } from "@/hooks";
import { displayValue, microToBase } from "@/utils";
import { useMemo } from "react";
import { useAssetMetadata } from "@/app/rebalancer/ui";

const DEFAULT_MIN_VALUE = {
  value: 10,
  symbol: "USD",
};

export const useMinimumRequiredValue = (baseDenom: string) => {
  const { getOriginAsset } = useAssetMetadata();
  const { data: whitelistedDenoms } = useWhitelistedDenoms();

  const minimumRequiredValue: {
    value: number;
    symbol: string;
  } = useMemo(() => {
    const whitelistedBaseAsset = whitelistedDenoms?.base_denom_whitelist.find(
      (a) => a.denom === baseDenom,
    );
    if (!whitelistedBaseAsset) return DEFAULT_MIN_VALUE;

    const originAsset =
      whitelistedBaseAsset?.denom &&
      getOriginAsset(whitelistedBaseAsset?.denom);
    if (!originAsset) return DEFAULT_MIN_VALUE;

    const value = microToBase(
      whitelistedBaseAsset?.min_balance_limit,
      originAsset.decimals,
    );

    return {
      value,
      symbol: originAsset.symbol,
      display: displayValue,
    };
  }, [baseDenom, getOriginAsset, whitelistedDenoms?.base_denom_whitelist]);

  return {
    ...minimumRequiredValue,
    denom: baseDenom,
  };
};
