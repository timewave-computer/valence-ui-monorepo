import { Button, LinkText } from "@/components";
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
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { HiMiniArrowRight } from "react-icons/hi2";
import { useAssetCache } from "@/app/rebalancer/hooks";

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

  const { getAsset } = useAssetCache();

  return (
    <section className="flex w-full flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_SelectAssets.title}
        </h1>
        {isBalancesFetched && balances?.length === 0 ? (
          <div className="mt-2 flex flex-col gap-2 border border-warn p-4">
            <div className="flex items-center gap-2 ">
              <BsExclamationCircle className="h-6 w-6 text-warn " />
              <WarnText
                className="text-base font-semibold text-warn"
                text="This wallet does not hold any assets supported by the Rebalancer."
              />
            </div>
            <p className="text-sm">
              Deposit at least 2 of the following assets into the wallet to
              continue:{" "}
              {chainConfig.supportedAssets.map((a) => a.symbol).join(", ")}
            </p>
            <div className="flex max-w-96  flex-row flex-wrap items-center gap-4 pt-4">
              <Button variant="secondary">
                <LinkText
                  className=" flex flex-row items-center gap-1.5 self-start"
                  href="https://www.usdc.com/#access"
                >
                  Buy USDC
                  <HiMiniArrowRight className="h-4 w-4" />
                </LinkText>
              </Button>
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
            <LoadingSkeleton className="mt-2 min-h-[200px]" />
          ) : (
            <div
              role="grid"
              className="grid w-1/2 grid-cols-[200px_160px_auto] justify-items-start  gap-x-4"
            >
              {balances
                ?.filter((b) => {
                  const asset = getAsset(b.denom);
                  return !!asset;
                })
                ?.map((balance) => {
                  const asset = getAsset(balance.denom);
                  const isSelected = assets.find(
                    (a) => a.denom === balance.denom,
                  );

                  let baseBalance = 0;
                  if (asset) {
                    baseBalance = microToBase(balance.amount, asset.decimals);
                  }
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
                        <span>{asset?.symbol ?? ""}</span>
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
                                  symbol: asset?.symbol ?? "",
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
