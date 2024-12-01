"use client";
import { microToBase, simulate } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/const/query-keys";
import { ErrorHandler } from "@/const/error";
import {
  useAccountConfigQuery,
  useAssetMetadata,
  useLivePortfolio,
} from "@/app/rebalancer/ui";
import { fetchAuctionLimits } from "@/server/actions";

type TradeStatusData = {
  currentValue: number;
  nextValue: number;
  tradeAmount: number;
  limit: number;
  denom: string;
};

export const useRebalanceStatusQuery = ({
  accountAddress,
}: {
  accountAddress: string;
}) => {
  const { data: config } = useAccountConfigQuery({
    account: accountAddress,
  });
  const { data: auctionLimits } = useAuctionLimits();

  const { data: livePortfolio } = useLivePortfolio({ accountAddress });
  const getOriginAsset = useAssetMetadata().getOriginAsset;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [
      QUERY_KEYS.IS_REBALANCE_COMPLETE,
      accountAddress,
      livePortfolio?.balances,
    ],
    enabled:
      !!config &&
      !!livePortfolio &&
      !!auctionLimits &&
      !!livePortfolio?.balances.length &&
      accountAddress !== "",
    queryFn: async (): Promise<{
      isRebalanceComplete: boolean;
      trades: TradeStatusData[];
    }> => {
      /**
       * takes next projection, compares to limits, and sees if there will be a trade following day
       */

      if (
        !config ||
        !livePortfolio ||
        !livePortfolio?.balances.length ||
        !auctionLimits ||
        accountAddress === ""
      )
        return {
          trades: [],
          isRebalanceComplete: false,
        };

      const { p, i, d } = config.pid;
      const convertedSendLimits = auctionLimits.map((l) => {
        const originAsset = getOriginAsset(l.denom);
        return {
          denom: l.denom,
          limit: microToBase(l.data.send, originAsset?.decimals ?? 6),
        };
      });

      const simulationInput = config.targets.map((t) => {
        const lineItem = livePortfolio.balances.find(
          (b) => t.denom === b.denom,
        );
        return {
          amount: lineItem?.balance.total ?? 0,
          price: lineItem?.price ?? 0,
          target: t.percentage,
        };
      });

      const projections = simulate(p, i, d, 1, simulationInput);
      const trades: TradeStatusData[] = [];
      config.targets.forEach((t, i) => {
        const currentValue = projections[0][i];
        const nextValue = projections[1][i];
        const limit = convertedSendLimits.find(
          (l) => l.denom === t.denom,
        )?.limit;
        if (!limit) {
          // should not happen but never say never
          ErrorHandler.makeError("No auction limit found for " + t.denom);
          return;
        }
        // can be negative
        const tradeAmount = nextValue - currentValue;

        trades.push({
          currentValue,
          nextValue,
          tradeAmount,
          limit,
          denom: t.denom,
        });
      });
      return {
        trades,
        isRebalanceComplete: trades.some(
          (t) => Math.abs(t.tradeAmount) < t.limit,
        ),
      };
    },
  });
};

const useAuctionLimits = () => {
  return useQuery({
    refetchInterval: 0,
    queryKey: [QUERY_KEYS.AUCTION_LIMITS],
    queryFn: async () => {
      return await fetchAuctionLimits();
    },
  });
};
