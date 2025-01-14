"use client";
import { UseFormReturn } from "react-hook-form";
import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import { Dropdown } from "@/components";
import {
  FormField,
  InputLabel,
  TextInput,
  FormControl,
  InfoText,
  LinkText,
  Heading,
} from "@valence-ui/ui-components";
import { Fragment, useState } from "react";
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
  CreateRebalancerCopy,
  RebalancerFormTooltipCopy,
} from "@/app/rebalancer/ui";
import { useAssetMetadata, useSettingsProjection } from "@/app/rebalancer/ui";
import { ValueTooltip } from "@/app/rebalancer/ui";

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
        <Heading level="h6">
          {" "}
          {CreateRebalancerCopy.step_Settings.title}
        </Heading>

        <div className="flex flex-col gap-2">
          <p className="w-3/4 text-sm ">
            {CreateRebalancerCopy.step_Settings.subTitle}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_1fr_1fr]">
        <div className="col-span-1 flex flex-col">
          <InputLabel
            size="sm"
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
              variant="highlighted"
              href="https://en.wikipedia.org/wiki/Proportional–integral–derivative_controller"
              blankTarget={true}
            >
              PID
            </LinkText>{" "}
            controller to determine the amounts to send to Rebalance each day.
            You can configure each parameter below.
          </p>
          <div className="grid grid-cols-[auto_auto_auto] gap-x-8 gap-y-1 pt-4">
            <InputLabel label="Proportional" size="sm" noGap />
            <InputLabel label="Integral Parameter" size="sm" noGap />

            <InputLabel label="Derivative" size="sm" noGap />

            {Object.keys(pid).map((key) => {
              const value = parseFloat(pid[key as PidKey]);

              return (
                <FormField key={`pid-input-${key}`} name={`pid-input-${key}`}>
                  <FormControl asChild>
                    <TextInput
                      size="sm"
                      isError={value < 0 || value > 1}
                      type="number"
                      placeholder="0"
                      {...register(`pid.${key as PidKey}`)}
                    />
                  </FormControl>
                </FormField>
              );
            })}
          </div>
          {Object.keys(pid).some((key) => {
            const value = parseFloat(pid[key as PidKey]);
            return value < 0 || value > 1;
          }) && (
            <InfoText className="pt-2" variant="error">
              All values must be between 0 and 1 (example: 0.1)
            </InfoText>
          )}
        </div>
      )}

      <div className="flex flex-col">
        <InputLabel
          size="sm"
          tooltipContent={RebalancerFormTooltipCopy.projection.text}
          label={RebalancerFormTooltipCopy.projection.title}
        />
        {isProjectionError && (
          <InfoText variant="error">
            Unable to generate projection with these inputs
          </InfoText>
        )}
        {!isProjectionEnabled && (
          <InfoText variant="info">
            Select an initial deposit and two targets to a generate projection
          </InfoText>
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
