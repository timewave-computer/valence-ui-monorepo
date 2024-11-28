import { QUERY_KEYS } from "@/const/query-keys";
import { CreateRebalancerForm } from "@/types/rebalancer";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import {
  useAssetMetadata,
  useLivePrices,
  useBaseTokenValue,
} from "@/app/rebalancer/ui";
import { UTCDate } from "@date-fns/utc";
import init, { do_pid } from "@/wasm/pid/pkg/pid";
import { addDays } from "date-fns";
import Decimal from "decimal.js";
import { GraphData } from "@/app/rebalancer/ui";
import { OriginAsset } from "@/types/ibc";
import { GraphKey, KeyTag } from "@/app/rebalancer/const";

const historicalYTickCount = 200;

type ProjectionInput = {
  symbol: string;
  initialBalance: number;
  targetBalance: number;
  price: number;
};
/***
 * for projection in the create form
 */
export const useSettingsProjection = (
  form: UseFormReturn<CreateRebalancerForm, any, undefined>,
) => {
  const { watch } = form;
  const targets = watch("targets");

  const validTargets = targets.filter((t) => !!t.denom);
  const targetsAddTo100 =
    validTargets.reduce((acc, target) => {
      return acc + target.bps;
    }, 0) === 100;
  const isTargetsValid = validTargets.length >= 2 && targetsAddTo100;

  const initialAssets = watch("initialAssets");
  const validInitialAssets = initialAssets.filter(
    (a) => !!a && !!a.startingAmount && !isNaN(a.startingAmount),
  );
  const isInitialAssetsValid =
    !!initialAssets && validInitialAssets.length >= 1;
  const pid = watch("pid");
  const baseTokenDenom = watch("baseTokenDenom");

  const { getPrice } = useLivePrices();
  const { getOriginAsset } = useAssetMetadata();

  const { calculateValue } = useBaseTokenValue({
    baseTokenDenom,
  });

  const enabled = isTargetsValid && isInitialAssetsValid;

  return {
    isEnabled: enabled,
    ...useQuery({
      enabled,
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey: [
        QUERY_KEYS.CREATE_PROJECTION_GRAPH,
        pid,
        validTargets,
        validInitialAssets,
      ],
      queryFn: () =>
        generateProjectionGraphData({
          initialAssets: validInitialAssets,
          targets: validTargets,
          getOriginAsset,
          getPrice,
          pid,
          calculateValue,
        }),
    }),
  };
};

const calculateTargetBalance = ({
  totalValue,
  targetPercentage,
  assetPrice,
}: {
  totalValue: number;
  targetPercentage: number;
  assetPrice: number;
}) => {
  const targetValue = targetPercentage * 0.01 * totalValue;
  const targetAmount = targetValue / assetPrice;
  return targetAmount;
};

const isGraphedKey = (key: string): boolean =>
  key.includes(KeyTag.projectedValue) ||
  key.includes(KeyTag.projectedTargetValue);

const generateYAxisTicks = (data: GraphData) => {
  if (!data || !data.length)
    return new Array(historicalYTickCount).fill(0).map((_, i) => {
      return 5000 * i;
    });

  let yMax = 0;
  let yMin = 0;

  data.forEach((d) => {
    const dItems = Object.entries(d);
    const graphedYValues = dItems
      .filter(([key, value]) => isGraphedKey(key))
      .map(([key, value]) => value);
    const localMax = Math.max(...graphedYValues);
    const localMin = Math.min(...graphedYValues);
    yMax = Math.max(yMax, localMax);
    yMin = Math.min(yMin, localMin);
  });

  const yRange = yMax - yMin;
  const yTickInterval = yRange / historicalYTickCount;

  return new Array(historicalYTickCount + 1).fill(0).map((_, i) => {
    return yMin + yTickInterval * i;
  });
};

const generateProjectionGraphData = async ({
  initialAssets,
  calculateValue,
  targets,
  getOriginAsset,
  getPrice,
  pid,
}: {
  initialAssets: CreateRebalancerForm["initialAssets"];
  pid: CreateRebalancerForm["pid"];
  targets: CreateRebalancerForm["targets"];
  getOriginAsset: (denom: string) => OriginAsset | undefined;
  getPrice: (denom: string) => number | undefined;
  calculateValue: ({
    amount,
    denom,
  }: {
    amount: number;
    denom: string;
  }) => number;
}) => {
  const totalValue = initialAssets.reduce((acc, asset) => {
    const value = calculateValue({
      amount: Number(asset.startingAmount),
      denom: asset.denom,
    });
    return acc + value;
  }, 0);

  const projectionInputs: ProjectionInput[] = [];

  targets.forEach(({ denom, bps }) => {
    if (!denom || !bps) return;
    const cachedAsset = getOriginAsset(denom);
    const price = getPrice(denom);
    const assetStartingAmount =
      initialAssets.find((asset) => asset?.denom === denom)?.startingAmount ??
      0;

    if (!cachedAsset || !price) return;
    projectionInputs.push({
      symbol: cachedAsset.symbol,
      price,
      initialBalance: assetStartingAmount,
      targetBalance: calculateTargetBalance({
        totalValue,
        targetPercentage: bps,
        assetPrice: price,
      }),
    });
  });

  const today = new UTCDate();
  const timestamps = Array.from({ length: historicalYTickCount }, (_, i) => {
    const d = addDays(today, i);
    return d.getTime();
  });

  const graphData: GraphData = await init().then(() => {
    const convertedPids = {
      p: parseFloat(pid.p) * 1000,
      i: parseFloat(pid.i) * 1000,
      d: parseFloat(pid.d) * 1000,
    };

    const convertedInitialData = projectionInputs.map(
      ({ symbol, initialBalance, targetBalance, price }) => {
        return {
          price,
          symbol: symbol,
          lastI: "0",
          lastInput: "0",
          currentBalance: initialBalance.toString(),
          targetBalance: targetBalance.toString(),
        };
      },
    );

    return timestamps.map((timestamp) => {
      let keepTrading = true;
      let result: any = {
        timestamp,
      };

      if (keepTrading) {
        convertedInitialData.forEach((denomData) => {
          let { i, value, ...rest } = do_pid({
            pid: convertedPids,
            input: denomData.currentBalance,
            target: denomData.targetBalance,
            dt: "1", // always 1
            last_i: denomData.lastI,
            last_input: denomData.lastInput,
          });
          denomData.lastI = i;
          denomData.lastInput = denomData.currentBalance;
          denomData.currentBalance = new Decimal(denomData.currentBalance)
            .plus(new Decimal(value))
            .toString();

          const roundedBalance = parseFloat(
            parseFloat(denomData.currentBalance).toPrecision(4),
          );
          // if value is between 0 and -1, stop trading
          // we will not sell less than 1 asset
          // can be a fraction if positive
          if (roundedBalance <= 0 && roundedBalance >= -1) keepTrading = false;

          result[GraphKey.projectedAmount(denomData.symbol)] = roundedBalance;
          result[GraphKey.projectedValue(denomData.symbol)] =
            roundedBalance * denomData.price;
          result[GraphKey.price(denomData.symbol)] = denomData.price;
          result[GraphKey.projectedTargetValue(denomData.symbol)] =
            parseFloat(denomData.targetBalance) * denomData.price;
        });
      } else {
        convertedInitialData.forEach((denomData) => {
          const roundedBalance = parseFloat(denomData.currentBalance);

          result[GraphKey.projectedAmount(denomData.symbol)] =
            roundedBalance.toPrecision(4);
          result[GraphKey.projectedValue(denomData.symbol)] =
            roundedBalance * denomData.price;

          result[GraphKey.projectedTargetValue(denomData.symbol)] =
            parseFloat(denomData.targetBalance) * denomData.price;
        });
      }

      return result;
    });
  });

  // every 10th timestamp
  const xTicks = timestamps.filter((_, index) => index % 20 === 0);

  const yTicks = generateYAxisTicks(graphData);

  const keys = projectionInputs.reduce(
    (acc: string[], input: ProjectionInput) => {
      acc.push(GraphKey.projectedAmount(input.symbol));
      acc.push(GraphKey.projectedValue(input.symbol));
      acc.push(GraphKey.projectedTargetValue(input.symbol));
      return acc;
    },
    [],
  );

  return {
    graphData,
    xTicks,
    yTicks,
    keys,
  };
};
