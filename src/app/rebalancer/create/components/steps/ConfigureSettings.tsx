import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import { Checkbox, Dropdown } from "@/components";
import { useState } from "react";
import { cn } from "@/utils";
import { TargetOverrideStrategy } from "@/types/rebalancer";
import { WarnText } from "@/app/rebalancer/create/components";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  CartesianGrid,
} from "recharts";
import {
  GraphKey,
  GraphStyles,
  Scale,
  scaleFormatter,
  SymbolColors,
} from "@/app/rebalancer/const";
import { useProjectionGraphV2 } from "@/app/rebalancer/hooks";
import { ValueTooltip } from "@/app/rebalancer/components";

type PidKey = keyof CreateRebalancerForm["pid"];
const AdvancedPid = "advanced-pid";
export const ConfigureSettings: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form }) => {
  const { watch, setValue, register } = form;
  const [showPid, setShowPid] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const pid = watch("pid");
  const initialAssets = watch("initialAssets");
  const strategy = watch("targetOverrideStrategy");

  const {
    isEnabled: isProjectionEnabled,
    data: projection,
    isError: isProjectionError,
  } = useProjectionGraphV2(form);

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
      <div className="grid grid-cols-[1fr_1fr_1fr]">
        <div className="col-span-1 flex flex-col gap-2">
          <div className="h-fit pb-1 text-xs font-medium">Rebalance speed</div>
          <Dropdown
            containerClassName="min-w-80"
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
        </div>
      </div>

      {showPid && (
        <div>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-8 gap-y-2 pt-4">
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
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="h-fit pb-1 text-xs font-medium">Projection</div>
        {isProjectionError && (
          <WarnText
            className="text-warn"
            text="Error: unable to generate projection with these inputs."
          />
        )}
        {!isProjectionEnabled && (
          <WarnText
            className="text-valence-gray"
            text="Select initial amounts and at least two targets to generate projected balances."
          />
        )}
        <div className="overflow-clip  bg-valence-lightgray">
          <ResponsiveContainer key={"pid-test"} height={300}>
            <LineChart
              margin={{ top: 0, left: 10, right: 0, bottom: 10 }}
              data={projection?.graphData}
            >
              <RechartTooltip
                content={<ValueTooltip keys={projection?.keys ?? []} />}
              />

              <YAxis
                type="number"
                className="font-sans text-xs"
                scale="linear"
                axisLine={{ stroke: "white" }}
                domain={[
                  0,
                  Math.max(...(projection?.yTicks ?? [0])) +
                    Math.max(...(projection?.yTicks ?? [0])) * 0.1,
                ]}
                tickFormatter={(value) =>
                  `$${Number(value).toLocaleString(undefined, {
                    notation: "compact",
                    maximumSignificantDigits: 2,
                  })}`
                }
                dx={-6}
              />
              <XAxis
                dataKey="timestamp"
                scale="time"
                type="number"
                tickFormatter={scaleFormatter[Scale.Month]}
                domain={["dataMin", "dataMax"]}
                ticks={projection?.xTicks ?? []}
                tickLine={false}
                axisLine={{ stroke: "white" }}
                className="font-sans text-xs text-valence-black"
              />
              {initialAssets.map((asset) => (
                <>
                  <Line
                    key={GraphKey.projectedValue(asset.symbol)}
                    dataKey={GraphKey.projectedValue(asset.symbol)}
                    type="monotone"
                    dot={false}
                    strokeWidth={GraphStyles.width.regular}
                    stroke={SymbolColors.get(asset.symbol)}
                    isAnimationActive={false}
                    strokeDasharray={GraphStyles.lineStyle.solid}
                  />
                  <Line
                    dataKey={GraphKey.projectedTargetValue(asset.symbol)}
                    type="monotone"
                    dot={false}
                    activeDot={false}
                    stroke={SymbolColors.get(asset.symbol)}
                    strokeWidth={GraphStyles.width.regular}
                    isAnimationActive={false}
                    strokeDasharray={GraphStyles.lineStyle.dotted}
                  />
                </>
              ))}
              <CartesianGrid syncWithTicks stroke="white" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-6 ">
        <div className="flex flex-row items-center gap-2 pt-2">
          <Checkbox
            checked={showAdvancedSettings}
            onChange={setShowAdvancedSettings}
          />
          <span className="">Show advanced settings</span>
        </div>
        {showAdvancedSettings && (
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-y-4">
            <div className="col-span-1 col-start-1 flex flex-col gap-2">
              <div className="h-fit pb-1 text-xs font-medium">
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
            <div className="col-span-1 col-start-1 flex flex-col gap-2 ">
              <div className="h-fit pb-1 text-xs font-medium">
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
          </div>
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
