"use client";
import {
  CreateRebalancerCopy,
  RebalancerFormTooltipCopy,
} from "@/app/rebalancer/create/copy";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import { Dropdown, LinkText } from "@/components";
import {
  FormTextInput,
  FormField,
  InputLabel,
} from "@valence-ui/ui-components";
import { Fragment, useState } from "react";
import { cn } from "@/utils";
import { WarnTextV2 } from "@/app/rebalancer/create/components";
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
import {
  useAssetMetadata,
  useSettingsProjection,
} from "@/app/rebalancer/hooks";
import { ValueTooltip } from "@/app/rebalancer/components";

type PidKey = keyof CreateRebalancerForm["pid"];
const CustomPid = "custom-pid";

export const RebalanceSpeed: React.FC<{
  address: string;
  form: UseFormReturn<CreateRebalancerForm, any, undefined>;
}> = ({ form }) => {
  const { watch, setValue, register } = form;
  const [showPid, setShowPid] = useState(false);

  const pid = watch("pid");
  const targets = watch("targets");
  const { getOriginAsset } = useAssetMetadata();

  const {
    isEnabled: isProjectionEnabled,
    data: projection,
    isError: isProjectionError,
  } = useSettingsProjection(form);

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
          <InputLabel
            tooltipContent={RebalancerFormTooltipCopy.rebalanceSpeed.text}
            label={RebalancerFormTooltipCopy.rebalanceSpeed.title}
          />
          <Dropdown
            containerClassName="min-w-80"
            selected={showPid ? CustomPid : watch(`pid.p`)}
            onSelected={(value) => {
              if (value === CustomPid) {
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
          <p className=" text-sm">
            The Rebalancer uses a{" "}
            <LinkText
              className=" border-valence-blue text-valence-blue hover:border-b"
              href="https://en.wikipedia.org/wiki/Proportional–integral–derivative_controller"
              openInNewTab={true}
            >
              PID
            </LinkText>{" "}
            controller to determine the amounts to send to Rebalance each day.
            You can configure each parameter below.
          </p>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-8 gap-y-2 pt-4">
            <InputLabel label="Proportional" />
            <InputLabel label="Integral Parameter" />

            <InputLabel label="Derivative" />

            {Object.keys(pid).map((key) => {
              const value = parseFloat(pid[key as PidKey]);

              return (
                <FormField key={`pid-input-${key}`} name={`pid-input-${key}`}>
                  <FormTextInput
                    role="gridcell"
                    isError={value < 0 || value > 1}
                    type="number"
                    placeholder="0"
                    {...register(`pid.${key as PidKey}`)}
                  />
                </FormField>
              );
            })}
          </div>
          {Object.keys(pid).some((key) => {
            const value = parseFloat(pid[key as PidKey]);
            return value < 0 || value > 1;
          }) && (
            <WarnTextV2
              className="pt-2"
              text="All values must be between 0 and 1 (example: 0.1)"
              variant="error"
            />
          )}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <InputLabel
          tooltipContent={RebalancerFormTooltipCopy.projection.text}
          label={RebalancerFormTooltipCopy.projection.title}
        />
        {isProjectionError && (
          <WarnTextV2
            variant="warn"
            text="Error: unable to generate projection with these inputs."
          />
        )}
        {!isProjectionEnabled && (
          <WarnTextV2
            variant="info"
            text="Select an initial deposit and two targets to a generate projection."
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

              <CartesianGrid syncWithTicks stroke="white" />
              {targets
                .filter((t) => !!t.denom)
                .map((target) => {
                  const asset = getOriginAsset(target.denom ?? "");
                  const symbol = asset?.symbol ?? "";
                  return (
                    <Fragment key={`lines-for-${symbol}`}>
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
                    </Fragment>
                  );
                })}
            </LineChart>
          </ResponsiveContainer>
        </div>
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
  { label: "Custom", value: CustomPid },
];
