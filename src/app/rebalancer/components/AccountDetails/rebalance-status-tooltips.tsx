"use client";
import {
  useAssetMetadata,
  useRebalanceStatusQuery,
} from "@/app/rebalancer/hooks";
import React from "react";
import { IconTooltipContent } from "@/components";
import { displayNumber } from "@/utils";

export const RebalanceInProgressTooltip: React.FC<{ address: string }> = ({
  address,
}) => {
  const { getOriginAsset } = useAssetMetadata();
  const { data: rebalanceStatus } = useRebalanceStatusQuery({
    accountAddress: address,
  });
  return (
    <IconTooltipContent title="Rebalance in progress">
      <p>
        Taking into account price, rebalance speed, and asset balances, the
        account is projected to undergo rebalancing in the next cycle.
      </p>
      {rebalanceStatus?.trades && (
        <div className="flex flex-col gap-0.5 pt-4">
          <p className="font-semibold">Projected trades</p>
          {rebalanceStatus?.trades.map((t) => {
            const asset = getOriginAsset(t.denom);
            const formattedAmount = displayNumber(t?.tradeAmount, {
              precision: 2,
            });
            return (
              <p className="font-mono" key={`preditected-trade-${t.denom}`}>
                {t.tradeAmount > 0 && "+"}
                {formattedAmount} {asset?.symbol}
              </p>
            );
          })}
        </div>
      )}
    </IconTooltipContent>
  );
};

export const DoneRebalancingTooltip: React.FC<{ address: string }> = ({
  address,
}) => {
  const { getOriginAsset } = useAssetMetadata();
  const { data: rebalanceStatus } = useRebalanceStatusQuery({
    accountAddress: address,
  });
  return (
    <IconTooltipContent title="Rebalancing complete" className=" max-w-80">
      <p>
        One or more trades projected for the next cycle are below the minimum
        auction amount. Rebalancing will resume if the rebalance speed is
        increased, more funds are deposited, or the price changes.
      </p>
      {rebalanceStatus?.trades && (
        <div className="flex flex-col gap-0.5 pt-4">
          <p className="font-semibold">Projected trades</p>
          {rebalanceStatus?.trades.map((t) => {
            const asset = getOriginAsset(t.denom);
            const formattedAmount = displayNumber(t?.tradeAmount, {
              precision: 2,
            });
            return (
              <p className="font-mono" key={`underlimit-${t.denom}`}>
                {t.tradeAmount > 0 && "+"}
                {formattedAmount} {asset?.symbol}{" "}
                {Math.abs(t.tradeAmount) < t.limit && (
                  <span className=" text-xs font-light tracking-tighter">
                    (below {t.limit} {asset?.symbol} auction minimum)
                  </span>
                )}
              </p>
            );
          })}
        </div>
      )}
    </IconTooltipContent>
  );
};
