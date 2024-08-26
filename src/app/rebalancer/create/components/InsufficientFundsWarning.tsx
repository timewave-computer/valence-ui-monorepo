import { Button, LinkText } from "@/components";
import { chainConfig } from "@/const/config";
import React from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { useWalletBalances } from "@/hooks";
import { WarnText } from "@/app/rebalancer/create/components";
import { HiMiniArrowRight } from "react-icons/hi2";
import { useMinimumRequiredValue } from "../../hooks";
import { displayValue } from "@/utils";

export const InsufficientFundsWarning: React.FC<{
  isHoldingMinimumFee: boolean;
  isHoldingAtLeastOneAsset: boolean;
  baseDenom: string;
  isEdit?: boolean;
}> = ({
  isHoldingMinimumFee,
  isHoldingAtLeastOneAsset,
  baseDenom,
  isEdit = false,
}) => {
  const { value, symbol } = useMinimumRequiredValue(baseDenom);

  const minimumValueDisplayString = displayValue({ value, symbol });

  if (isHoldingMinimumFee) return;

  return (
    <div className="mt-2 flex flex-col gap-2 border border-warn p-4">
      {!isHoldingAtLeastOneAsset ? (
        <>
          {isEdit ? (
            <NoSupportedAssetsInAccountMessage />
          ) : (
            <NoSupportedAssetsInWalletMessage />
          )}
          {
            <RequiredValueMessage
              requiredValueString={minimumValueDisplayString}
            />
          }
        </>
      ) : (
        <>{MinimumFeeMessage}</>
      )}
      <div className="flex  flex-row flex-wrap items-center gap-4 pt-4">
        <Button variant="secondary">
          <LinkText
            className=" flex flex-row items-center gap-1.5 self-start"
            href="https://go.skip.build/"
          >
            Bridge assets to Neutron
            <HiMiniArrowRight className="h-4 w-4" />
          </LinkText>
        </Button>
        <Button variant="secondary">
          <LinkText
            className=" flex flex-row items-center gap-1.5 self-start"
            href="https://app.astroport.fi/swap"
          >
            Swap on Astroport
            <HiMiniArrowRight className="h-4 w-4" />
          </LinkText>
        </Button>
        <Button variant="secondary">
          <LinkText
            className=" flex flex-row items-center gap-1.5 self-start"
            href="https://app.osmosis.zone/"
          >
            Swap on Osmosis
            <HiMiniArrowRight className="h-4 w-4" />
          </LinkText>
        </Button>
      </div>
    </div>
  );
};

const RequiredValueMessage = ({
  requiredValueString,
}: {
  requiredValueString: string;
}) => {
  return (
    <p className="text-sm">
      The Rebalancer requires a minimum value of {requiredValueString} to be in
      your account.
    </p>
  );
};

const NoSupportedAssetsInWalletMessage = () => (
  <>
    <div className="flex items-center gap-2 ">
      <BsExclamationCircle className="h-6 w-6 text-warn " />
      <WarnText
        className="text-base font-semibold text-warn"
        text="This wallet does not hold any assets supported by the Rebalancer."
      />
    </div>
    <p className="text-sm">
      Deposit at least one of the following assets into your wallet to continue:{" "}
      {chainConfig.supportedAssets.map((a) => a.symbol).join(", ")}.
    </p>
  </>
);

// for edit
const NoSupportedAssetsInAccountMessage = () => (
  <>
    <div className="flex items-center gap-2 ">
      <BsExclamationCircle className="h-6 w-6 text-warn " />
      <WarnText
        className="text-base font-semibold text-warn"
        text="This Rebalancer account does not hold any assets supported by the Rebalancer."
      />
    </div>
    <p className="text-sm">
      Deposit at least one of the following assets into the account to continue:{" "}
      {chainConfig.supportedAssets.map((a) => a.symbol).join(", ")}.
    </p>
  </>
);

const MinimumFeeMessage = (
  <>
    <div className="flex items-center gap-2 ">
      <BsExclamationCircle className="h-6 w-6 text-warn " />
      <WarnText
        className="text-base font-semibold text-warn"
        text="A fee of 1 NTRN is required to create a Rebalancer."
      />
    </div>
    <p className="text-sm">Deposit at least 1 NTRN into the wallet.</p>
  </>
);

export const useInsufficientFundsWarning = (address: string) => {
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
