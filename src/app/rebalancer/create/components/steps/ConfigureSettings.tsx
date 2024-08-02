import { CreateRebalancerCopy } from "@/app/rebalancer/create/copy";
import { UseFormReturn } from "react-hook-form";

import { CreateRebalancerForm } from "@/types/rebalancer/create-rebalancer";
import { Checkbox, Dropdown } from "@/components";
import { useState } from "react";
import { cn } from "@/utils";
import { TargetOverrideStrategy } from "@/types/rebalancer";

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
  const strategy = watch("targetOverrideStrategy");

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
          <div className=" grid grid-cols-[200px_200px_200px] gap-x-4 gap-y-2 pt-4">
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
        )}
      </div>
      <div className="col-span-full flex h-80 w-3/4 flex-col items-center justify-center border bg-valence-lightgray">
        projection here
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
