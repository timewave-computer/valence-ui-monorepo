import { Button, LinkText } from "@/components";
import { chainConfig } from "@/const/config";
import React from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { useWalletBalances } from "@/hooks";
import { WarnTextV2 } from "@/app/rebalancer/create/components";
import { HiMiniArrowRight } from "react-icons/hi2";
import { useMinimumRequiredValue } from "../../hooks";
import { displayValue } from "@/utils";

export const MissingServiceFeeWarning: React.FC<{}> = () => {
  return (
    <div className="mt-2 flex flex-col gap-2 border border-warn p-4">
      <div className="flex items-center gap-2 ">
        <BsExclamationCircle className="h-6 w-6 text-warn " />
        <WarnTextV2
          variant="warn"
          text={`A service fee is required to enable rebalancing.`}
        />
      </div>
      <p className="text-sm">
        Deposit {chainConfig.serviceFee.amount} {chainConfig.serviceFee.symbol}{" "}
        into the wallet.
      </p>
    </div>
  );
};

export const InsufficientFundsWarning: React.FC<{
  isHoldingAtLeastOneAsset: boolean;
  baseDenom: string;
  isEdit?: boolean;
}> = ({ isHoldingAtLeastOneAsset, isEdit = false }) => {
  return (
    <div className="mt-2 flex flex-col gap-2 border border-warn p-4">
      {!isHoldingAtLeastOneAsset && (
        <>
          {isEdit ? (
            <NoSupportedAssetsInAccountMessage />
          ) : (
            <NoSupportedAssetsInWalletMessage />
          )}
        </>
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

const NoSupportedAssetsInWalletMessage = () => (
  <>
    <div className="flex items-center gap-2 ">
      <BsExclamationCircle className="h-6 w-6 text-warn " />
      <WarnTextV2
        variant="warn"
        text="This wallet does not hold any assets supported by the Rebalancer."
      />
    </div>
    <p className="text-sm">
      Deposit at least one asset supported by the Rebalancer, and{" "}
      {chainConfig.serviceFee.amount} {chainConfig.serviceFee.symbol} for the
      service fee.
    </p>
  </>
);

// for edit
const NoSupportedAssetsInAccountMessage = () => (
  <>
    <div className="flex items-center gap-2 ">
      <BsExclamationCircle className="h-6 w-6 text-warn " />
      <WarnTextV2
        variant="warn"
        text="This account does not hold any assets supported by the Rebalancer."
      />
    </div>
    <p className="text-sm">
      Deposit at least one asset supported by the Rebalancer.
    </p>
  </>
);

const MinimumFeeMessage = (
  <>
    <div className="flex items-center gap-2 ">
      <BsExclamationCircle className="h-6 w-6 text-warn " />
      <WarnTextV2
        variant="warn"
        text={`A service fee is required to enable rebalancing.`}
      />
    </div>
    <p className="text-sm">
      Deposit {chainConfig.serviceFee.amount} {chainConfig.serviceFee.symbol}{" "}
      into the wallet.
    </p>
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
