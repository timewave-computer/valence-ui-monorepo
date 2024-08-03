import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import { Checkbox, Dropdown } from "@/components";
import { useState } from "react";
import { cn } from "@/utils";
import { TargetOverrideStrategy } from "@/types/rebalancer";
import { WarnText } from "../PlaceHolderRows";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { GraphStyles, SymbolColors } from "@/app/rebalancer/const";
import {
  useAssetCache,
  useBaseTokenValue,
  usePriceCache,
  useProjectionGraph,
} from "@/app/rebalancer/hooks";

// hiding for now as its buggy
export const hideProjection = true;

// we are given the initial balance, initial value, price, current percentage by value, and the target percentage by value
// targetPercentage by value = amount * price / total value
// amount = targetPercentage * total value / price
const calculateTargetBalance = ({
  totalValue,
  targetPercentage,
  assetPrice,
}: {
  totalValue: number;
  targetPercentage: number;
  assetPrice: number;
}) => {
  return (targetPercentage * totalValue) / assetPrice / 1000;
};

type PidKey = keyof CreateRebalancerForm["pid"];
const AdvancedPid = "advanced-pid";
export const ConfigureSettings: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form, address }) => {
  const { watch, setValue, register } = form;
  const [showPid, setShowPid] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const baseTokenDenom = watch("baseTokenDenom");

  const pid = watch("pid");
  const assets = watch("assets");
  const targets = watch("targets");
  const strategy = watch("targetOverrideStrategy");

  const { calculateValue } = useBaseTokenValue({
    baseTokenDenom,
  });

  const totalValue = assets.reduce((acc, asset) => {
    const value = calculateValue({
      amount: Number(asset.startingAmount),
      denom: asset.denom,
    });
    return acc + value;
  }, 0);

  const { getPrice } = usePriceCache();
  const { getAsset } = useAssetCache();

  const projectionInputs = targets.map(({ denom, bps }) => {
    const cachedAsset = getAsset(denom);
    const price = getPrice(denom);

    const assetInput = assets.find((asset) => asset.denom === denom);

    if (!assetInput || !price) {
      // ok to ignore
      return {
        symbol: "",
        initialBalance: 0,
        targetBalance: 0,
      };
    }
    return {
      symbol: cachedAsset?.symbol ?? "",
      initialBalance: assetInput.startingAmount ?? 0,
      targetBalance: calculateTargetBalance({
        totalValue,
        targetPercentage: bps,
        assetPrice: price,
      }),
    };
  });

  const { graphData, xAxisTicks, xTicks } = useProjectionGraph({
    pids: pid,
    initialData: projectionInputs,
  });

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold">
          {CreateRebalancerCopy.step_Settings.title}
        </h1>
        <div className="flex flex-col gap-2">
          <p className="w-3/4 text-sm ">
            {CreateRebalancerCopy.step_Settings.subTitle}
          </p>
        </div>
      </div>
      <div className="max-w-[420px]">
        <div className="w-full pb-1 font-semibold">Rebalance speed</div>
        <Dropdown
          selected={showPid ? AdvancedPid : watch(`pid.p`)}
          onSelected={(value) => {
            if (value === AdvancedPid) {
              setShowPid(true);
            } else {
              setShowPid(false);
              setValue(`pid`, {
                p: value,
                i: "0",
                d: "0",
              });
            }
          }}
          options={RebalanceSpeedOptions}
        />
        {showPid && (
          <>
            <div className="grid grid-cols-[200px_200px_200px] gap-x-4 gap-y-2 pt-4">
              <div
                role="columnheader"
                className="font-base font-base   flex items-end  text-xs"
              >
                Proportional
              </div>

              <div
                role="columnheader"
                className="font-base font-base  flex items-end  text-xs"
              >
                Integral
              </div>
              <div
                role="columnheader"
                className="font-base font-base  flex items-end  text-xs"
              >
                Derivative
              </div>

              {Object.keys(pid).map((key) => {
                return (
                  <div
                    key={`pid-input-${key}`}
                    role="gridcell"
                    className={cn(
                      "min-h-11",
                      "font-mono",
                      "border-valence-lightgray bg-valence-lightgray",
                      "relative flex items-center border-[1.5px]  focus-within:border-valence-blue",
                    )}
                  >
                    <input
                      key={key}
                      className={cn(
                        "h-full w-full bg-transparent p-1 focus:outline-none",
                      )}
                      type="number"
                      placeholder="0.00"
                      {...register(`pid.${key as PidKey}`)}
                    />
                  </div>
                );
              })}
            </div>
            {Object.keys(pid).some((key) => {
              const value = parseFloat(pid[key as PidKey]);
              return value < 0 || value >= 1;
            }) && (
              <WarnText
                className="pt-2 text-warn"
                text="All values must be between 0 and 1 (example: 0.1)"
              />
            )}
          </>
        )}
      </div>
      {
        // hiding for now as its buggy
        hideProjection ? (
          <div className="flex h-48 flex-col items-center bg-valence-mediumgray p-4">
            TODO: projection
          </div>
        ) : (
          <ResponsiveContainer key={"pid-test"} height={300}>
            <LineChart data={graphData} margin={{}}>
              <YAxis
                type="number"
                domain={["dataMin", "dataMax"]}
                scale="linear"
              />
              <XAxis
                dataKey="timestamp"
                scale="time"
                type="number"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  const day = date.getDate(); // Get the day of the month (1-31)
                  const month = date.getMonth() + 1; // Get the month (0-indexed, so add 1)
                  return `${month}/${day}`;
                }}
                domain={[xAxisTicks[0], xAxisTicks[xAxisTicks.length - 1]]}
                ticks={xTicks}
              />
              {assets.map((asset) => (
                <Line
                  key={`${asset.symbol}_curr_balance`}
                  dataKey={`${asset.symbol}_curr_balance`}
                  type="monotone"
                  dot={false}
                  strokeWidth={GraphStyles.width.regular}
                  stroke={SymbolColors.get(asset.symbol)}
                  isAnimationActive={false}
                  strokeDasharray={GraphStyles.lineStyle.solid}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
      }

      <div className="flex flex-col gap-6 ">
        <div className="flex flex-row items-center gap-2 pt-2">
          <Checkbox
            checked={showAdvancedSettings}
            onChange={setShowAdvancedSettings}
          />
          <span className="">Show advanced settings</span>
        </div>
        {showAdvancedSettings && (
          <>
            <div className="max-w-[200px] ">
              <div className="w-full pb-1 font-semibold">
                Target override strategy
              </div>

              <Dropdown
                selected={strategy}
                onSelected={(value) => {
                  setValue("targetOverrideStrategy", value);
                }}
                options={TargetOverrideStartegyOptions}
              />
            </div>
            <div className="max-w-[200px] ">
              <div className="w-full pb-1 font-semibold">
                Maximum daily limit
              </div>

              <div className="relative flex items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue ">
                <input
                  placeholder="0.00"
                  className="h-full w-full max-w-[60%]  bg-transparent p-2 font-mono focus:outline-none  "
                  type="number"
                  {...register(`maxLimit`)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const RebalanceSpeedOptions = [
  {
    label: "Slow (rebalance 5% daily)",
    value: "0.05",
  },
  {
    label: "Medium (rebalance 10% daily)",
    value: "0.1",
  },
  {
    label: "Fast (rebalance 20% daily)",
    value: "0.2",
  },
  { label: "Advanced", value: AdvancedPid },
];

const TargetOverrideStartegyOptions: Array<{
  label: string;
  value: TargetOverrideStrategy;
}> = [
  {
    label: "Proportional",
    value: "proportional",
  },
  {
    label: "Priority",
    value: "priority",
  },
];
