import { Button } from "@/components";
import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { chainConfig } from "@/const/config";
import { Fragment, useCallback } from "react";
import { BsExclamationCircle, BsPlus } from "react-icons/bs";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { UseFormReturn } from "react-hook-form";
import { useSupportedBalances } from "@/hooks";
import { cn, displayNumber, displayValue, microToBase } from "@/utils";
import { produce } from "immer";
import { WarnText } from "@/app/rebalancer/create/components";

export const DisplayWalletAddresses: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const {
    data: balances,
    isLoading: isLoadingBalances,
    isFetched: isBalancesFetched,
  } = useSupportedBalances(address);
  const { setValue, watch } = form;

  const assets = watch("assets");

  const addAsset = useCallback(
    (assetToAdd: CreateRebalancerForm["assets"][number]) => {
      return produce(assets, (draft: CreateRebalancerForm["assets"]) => {
        draft.push(assetToAdd);
      });
    },
    [assets],
  );

  return (
    <section className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_SelectAssets.title}
        </h1>
        {isBalancesFetched && balances?.length === 0 ? (
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center gap-2">
              <BsExclamationCircle className="h-6 w-6 text-valence-red" />
              <WarnText
                className="text-valence-red"
                text="This wallet does not contain any assets supported by the Rebalancer."
              />
            </div>

            <p className="text-sm">
              <span className="font-semibold">Supported assets</span>:{" "}
              {chainConfig.supportedAssets.map((a) => a.symbol).join(", ")}
            </p>
            <p className="text-sm">
              Please deposit a mimimum of two supported assets to continue.
            </p>
          </div>
        ) : (
          <p className="w-3/4 text-sm">
            {CreateRebalancerCopy.step_SelectAssets.subTitle}
          </p>
        )}
      </div>

      {isBalancesFetched && balances?.length !== 0 && (
        <div>
          <div className="w-full font-semibold">Available funds</div>

          {isLoadingBalances ? (
            <div className="mt-2 min-h-[200px] animate-pulse bg-valence-lightgray"></div>
          ) : (
            <div
              role="grid"
              className="grid w-1/2 grid-cols-[200px_160px_auto] justify-items-start  gap-x-4"
            >
              {balances?.map((balance) => {
                const baseBalance = microToBase(
                  balance.amount,
                  balance.asset.decimals,
                );
                const isSelected = assets.find(
                  (a) => a.denom === balance.denom,
                );
                const valueDisplayString = displayValue({
                  value: displayNumber(baseBalance * balance.price, {
                    precision: 2,
                  }),
                  symbol: "USDC", // always value in usd for first section, for now
                });
                return (
                  <Fragment key={`wallet-balance-row-${balance.denom}`}>
                    <div
                      role="gridcell"
                      className="flex  min-h-11 w-full items-center justify-between font-mono "
                    >
                      <span>
                        {displayNumber(baseBalance, { precision: null })}
                      </span>
                      <span>{balance.asset.symbol}</span>
                    </div>

                    <div
                      role="gridcell"
                      className="flex w-full items-center  p-1  font-mono font-light"
                    >
                      ({valueDisplayString})
                    </div>
                    <div
                      role="gridcell"
                      className="flex w-full items-center justify-self-end p-1 "
                    >
                      {!isSelected && (
                        <Button
                          variant="primary"
                          className={cn(
                            " flex w-full items-center justify-start gap-2 text-nowrap py-1 transition-all",
                          )}
                          onClick={() => {
                            setValue(
                              "assets",
                              addAsset({
                                symbol: balance.asset.symbol,
                                denom: balance.denom,
                                startingAmount: undefined,
                              }),
                            );
                          }}
                        >
                          <BsPlus className="h-6 w-6" />
                          <span>Add to Rebalancer</span>
                        </Button>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
