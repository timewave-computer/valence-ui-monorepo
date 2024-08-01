import { usePrice } from "@/hooks";
import { FetchSupportedBalancesReturnValue } from "@/server/actions";
import { OriginAsset } from "@/types/ibc";
import { get } from "lodash";
import { useCallback, useMemo } from "react";

/***
 * what interface do i need?
 *
 * functions to
 * - get asset by denom from balances
 * - calc value in base denom
 * - calc total value + distribution
 */

export const getBalance = (
  denom?: string,
  balances?: FetchSupportedBalancesReturnValue,
): FetchSupportedBalancesReturnValue[number] | undefined => {
  return balances?.find((balance) => balance.denom === denom);
};

/***
 * calcs value with base token in mind
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
    price = usdcPrice ?? 0 / Number(baseTokenPrice ?? 0);
  }
  return amount * price;
};

export const useBaseTokenValue = ({
  balances,
  baseTokenDenom,
}: {
  balances?: FetchSupportedBalancesReturnValue;
  baseTokenDenom?: string;
}) => {
  const getBalance = useCallback(
    (denom?: string): FetchSupportedBalancesReturnValue[number] | undefined => {
      return balances?.find((balance) => balance.denom === denom);
    },
    [balances],
  );

  const baseTokenAsset = getBalance(baseTokenDenom);
  const isBaseTokenUsdc = baseTokenAsset?.asset.symbol === "USDC";

  const { data: baseTokenPrice, isLoading: isBaseTokenPriceLoading } = usePrice(
    {
      coinGeckoId: baseTokenAsset?.asset.coingecko_id,
    },
  );

  const calculateValue = useCallback(
    (amount: number, denom: string) => {
      // TODO: this is only used for asset metadata. questionable solution that should be fetched from cache in longer term
      const bal = getBalance(denom);
      return calculateValueInBaseDenom({
        amount: Number(amount),
        isUsdcBase: bal?.asset.symbol === "USDC",
        usdcPrice: bal?.price,
        baseTokenPrice: baseTokenPrice,
      });
    },
    [getBalance, balances, baseTokenPrice],
  );

  const totalValue = useMemo(() => {
    if (!balances?.length) return 0;
    return balances.reduce((acc, b) => {
      const value = calculateValueInBaseDenom({
        amount: Number(b.amount),
        isUsdcBase: isBaseTokenUsdc,
        usdcPrice: b.price,
        baseTokenPrice: baseTokenPrice,
      });
      return acc + value;
    }, 0);
  }, [balances, isBaseTokenUsdc, baseTokenPrice]);

  return {
    baseTokenAsset: baseTokenAsset?.asset,
    getBalance,
    totalValue,
    isBaseTokenUsdc,
    isLoading: isBaseTokenPriceLoading,
    calculateValue,
  };
};
