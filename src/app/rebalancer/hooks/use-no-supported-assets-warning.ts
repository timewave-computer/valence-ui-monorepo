import { chainConfig } from "@/const/config";
import { useWalletBalances } from "@/hooks";

export const useNoSupportedAssetsWarning = (address: string) => {
  const { data: balances } = useWalletBalances(address);

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
