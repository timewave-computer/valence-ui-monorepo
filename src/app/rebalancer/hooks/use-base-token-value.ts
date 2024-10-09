import { FetchSupportedBalancesReturnValue } from "@/server/actions";
import { useCallback } from "react";
import { useAssetMetadata, useLivePrices } from "@/app/rebalancer/hooks";

export const getBalance = (
  denom?: string,
  balances?: FetchSupportedBalancesReturnValue,
): FetchSupportedBalancesReturnValue[number] | undefined => {
  return balances?.find((balance) => balance.denom === denom);
};

/***
 * calcs value with base token in consideration
 *   if base is not usdc:
 *      assetA in usdc  / assetB in usdc = assetA in assetB
 */
const calculateValueInBaseDenom = ({
  amount,
  isUsdcBase,
  usdcPrice,
  baseTokenPrice,
}: {
  amount: number;
  isUsdcBase: boolean;
  usdcPrice?: number;
  baseTokenPrice?: number;
}) => {
  let price: number;
  if (isUsdcBase) {
    price = usdcPrice ?? 0;
  } else {
    price = (usdcPrice ?? 0) / Number(baseTokenPrice ?? 0);
  }
  return amount * price;
};

export const useBaseTokenValue = ({
  baseTokenDenom,
}: {
  baseTokenDenom?: string;
}) => {
  const { getOriginAsset } = useAssetMetadata();
  const { getPrice } = useLivePrices();
  const baseAsset = getOriginAsset(baseTokenDenom ?? "");
  const basePrice = getPrice(baseTokenDenom ?? "");

  const isBaseTokenUsdc = baseAsset?.symbol === "USDC";

  const calculateValue = useCallback(
    ({ denom, amount }: { denom: string; amount?: number }) => {
      const price = getPrice(denom);

      return calculateValueInBaseDenom({
        amount: Number(amount ?? 0),
        isUsdcBase: baseAsset?.symbol === "USDC",
        usdcPrice: price,
        baseTokenPrice: basePrice,
      });
    },
    [baseAsset, getPrice, basePrice],
  );

  return {
    baseTokenAsset: baseAsset,
    getBalance,
    isBaseTokenUsdc,
    isLoading: false,
    calculateValue,
  };
};
