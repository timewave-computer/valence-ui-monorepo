import { Button, LinkText } from "@/components";
import { chainConfig } from "@/const/config";
import React from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { useWalletBalances } from "@/hooks";
import { WarnTextV2 } from "@/app/rebalancer/create/components";
import { HiMiniArrowRight } from "react-icons/hi2";

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
  isEdit?: boolean;
  address: string;
}> = ({ isHoldingAtLeastOneAsset, isEdit = false, address }) => {
  return (
    <div className="mt-2 flex flex-col gap-2 border border-warn p-4">
      {!isHoldingAtLeastOneAsset && (
        <>
          {isEdit ? (
            <NoSupportedAssetsInAccountMessage address={address} />
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

// for create
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
      Deposit at least one supported asset and {chainConfig.serviceFee.amount}{" "}
      {chainConfig.serviceFee.symbol} for the service fee.
    </p>
  </>
);

// for edit
const NoSupportedAssetsInAccountMessage = ({
  address,
}: {
  address: string;
}) => (
  <>
    <div className="flex items-center gap-2 ">
      <BsExclamationCircle className="h-6 w-6 text-warn " />
      <WarnTextV2
        variant="warn"
        text="Rebalancer account does not hold any assets supported by the Rebalancer."
      />
    </div>
    <p className="text-sm">
      Deposit funds into the Rebalancer account to continue{" "}
      <span className="font-mono text-sm font-light">({address})</span>.
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
