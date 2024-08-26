import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import {
  Dropdown,
  IconButton,
  QuestionTooltipContent,
  WithQuestionTooltip,
} from "@/components";
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
import { useAssetCache, useProjectionGraphV2 } from "@/app/rebalancer/hooks";
import { ValueTooltip } from "@/app/rebalancer/components";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { getAsset } from "node:sea";
import { symbol } from "zod";

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
  const targets = watch("targets");
  const strategy = watch("targetOverrideStrategy");
  const { getOriginAsset } = useAssetCache();

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
          <WithQuestionTooltip
            tooltipContent={
              <QuestionTooltipContent title="Rebalance speed" subtext="TODO" />
            }
          >
            {" "}
            <div className="h-fit pb-1 text-xs font-medium">
              Rebalance speed
            </div>
          </WithQuestionTooltip>
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
          <p className="py-2 text-sm">
            {CreateRebalancerCopy.step_Settings.infoPid}
          </p>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-8 gap-y-2 pt-4">
            <div
              role="columnheader"
              className="font-base font-base   flex items-end  text-xs"
            >
              <WithQuestionTooltip
                tooltipContent={
                  <QuestionTooltipContent
                    title="Proportional parameter"
                    subtext="TODO"
                  />
                }
              >
                Proportional
              </WithQuestionTooltip>
            </div>

            <div
              role="columnheader"
              className="font-base font-base  flex items-end  text-xs"
            >
              <WithQuestionTooltip
                tooltipContent={
                  <QuestionTooltipContent
                    title="Integral parameter"
                    subtext="TODO"
                  />
                }
              >
                Integral Parameter
              </WithQuestionTooltip>
            </div>
            <div
              role="columnheader"
              className="font-base font-base  flex items-end  text-xs"
            >
              <WithQuestionTooltip
                tooltipContent={
                  <QuestionTooltipContent
                    title="Derivative parameter"
                    subtext="TODO"
                  />
                }
              >
                Derivative
              </WithQuestionTooltip>
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
            text="Select initial deposits and at least two targets to generate projected balances."
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
              {targets
                .filter((t) => !!t.denom)
                .map((target) => {
                  const asset = getOriginAsset(target.denom ?? "");
                  const symbol = asset?.symbol ?? "";
                  return (
                    <>
                      <Line
                        key={GraphKey.projectedValue(symbol)}
                        dataKey={GraphKey.projectedValue(symbol)}
                        type="monotone"
                        dot={false}
                        strokeWidth={GraphStyles.width.regular}
                        stroke={SymbolColors.get(symbol)}
                        isAnimationActive={false}
                        strokeDasharray={GraphStyles.lineStyle.solid}
                      />
                      <Line
                        dataKey={GraphKey.projectedTargetValue(symbol)}
                        type="monotone"
                        dot={false}
                        activeDot={false}
                        stroke={SymbolColors.get(symbol)}
                        strokeWidth={GraphStyles.width.regular}
                        isAnimationActive={false}
                        strokeDasharray={GraphStyles.lineStyle.dotted}
                      />
                    </>
                  );
                })}
              <CartesianGrid syncWithTicks stroke="white" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-6 ">
        <div className="flex flex-row items-center gap-2 pt-2">
          <span className="text-sm">Advanced settings</span>

          <IconButton
            className="h-4 w-4"
            Icon={showAdvancedSettings ? FaChevronDown : FaChevronLeft}
            onClick={() => {
              setShowAdvancedSettings(!showAdvancedSettings);
            }}
          />
        </div>
        {showAdvancedSettings && (
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-y-4">
            <div className="col-span-1 col-start-1 flex flex-col gap-2">
              <div className="h-fit pb-1 text-xs font-medium">
                <WithQuestionTooltip
                  tooltipContent={
                    <QuestionTooltipContent
                      title="Target override strategy"
                      subtext="TODO"
                    />
                  }
                >
                  Target override strategy
                </WithQuestionTooltip>
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
                <WithQuestionTooltip
                  tooltipContent={
                    <QuestionTooltipContent
                      title="Maximum daily limit"
                      subtext="TODO"
                    />
                  }
                >
                  Maximum daily limit
                </WithQuestionTooltip>
              </div>

              <div className="relative flex items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue ">
                <input
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
