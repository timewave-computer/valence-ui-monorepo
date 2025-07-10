import { chainConfig } from "@/const/config";
import { useRebalancerAssetBalances } from "@/app/rebalancer/ui";

export const useNoSupportedAssetsWarning = (address: string) => {
  const { data: balances } = useRebalancerAssetBalances(address);

  const feeBalance = balances?.find(
    (b) => b.denom === chainConfig.serviceFee.denom,
  );
  const isHoldingMinimumFee =
    !!feeBalance &&
    parseFloat(feeBalance.amount) > chainConfig.serviceFee.amount;

  return {
    isHoldingMinimumFee,
    isHoldingAtLeastOneAsset: !!balances && balances?.length > 0,
  };
};
