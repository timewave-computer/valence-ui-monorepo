import { KeyTag, GraphKey } from "@/app/rebalancer/const/graph";
import { displayQuantity, displayUtcTime } from "@/utils";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { ColoredDot } from "@/app/rebalancer/components";

export const ValueTooltip = ({
  active,
  payload,
  label,
  keys,
}: TooltipProps<ValueType, NameType> & {
  keys: string[];
}) => {
  const date = new Date(label);
  if (!payload || !payload.length) return;
  const data = payload[0].payload;
  if (!active || !payload || !payload.length) return null;

  const isProjection = Object.keys(data).some((k) =>
    k.includes(KeyTag.projectedValue),
  );

  const totalValue = Object.keys(data)
    .filter((k) => {
      return isProjection
        ? k.includes(KeyTag.projectedValue)
        : k.includes(KeyTag.value);
    })
    .map((k) => {
      const denom = k.split(".")[0];

      const value = isProjection
        ? Number(data[GraphKey.projectedValue(denom)])
        : Number(data[GraphKey.value(denom)]);
      return value;
    })
    .reduce((acc: number, value: number) => {
      return acc + value;
    });

  return (
    <div className="flex flex-col gap-2 border-[0.5px] border-valence-black bg-white p-4">
      <div className=" ">
        <div className="self-start text-lg font-semibold">
          {isProjection ? "Projected Balances" : "Balances"}
        </div>
        <div className="flex items-end gap-0.5 text-xs">
          <span>{date.toLocaleDateString()} </span>
          <span>{displayUtcTime(date)}</span>{" "}
        </div>
      </div>
      <table>
        <thead>
          <tr className="p-1">
            <th className="px-2 text-start" scope="col">
              Asset
            </th>
            <th className="px-2 text-start" scope="col">
              Amount
            </th>
            <th className="px-2 text-start" scope="col">
              USD Value
            </th>
          </tr>
        </thead>
        <tbody>
          {isProjection
            ? keys
                .filter((k) => k.includes(KeyTag.projectedValue))
                .map((k: string, i: number) => {
                  const denom = k.split(".")[0];
                  let amount = data[GraphKey.projectedAmount(denom)];
                  if (isNaN(amount)) amount = 0;
                  let value = data[GraphKey.projectedValue(denom)];
                  if (isNaN(value)) value = 0;

                  return (
                    <tr key={`tooltip-${label}-${k}`} className="p-0.5">
                      <th
                        className={
                          "flex items-center gap-1 p-0.5 px-2 text-start"
                        }
                        scope="row"
                      >
                        <ColoredDot i={i} />
                        <span>{denom}</span>
                      </th>
                      <td className="p-0.5 px-2 text-end">
                        {displayQuantity.format(amount)}
                      </td>
                      <td className="p-0.5 px-2 text-end">{`$${displayQuantity.format(value)}`}</td>
                    </tr>
                  );
                })
            : keys
                .filter((k) => k.includes(KeyTag.value))
                .map((k: string, i: number) => {
                  const denom = k.split(".")[0];
                  let amount = data[GraphKey.balance(denom)];
                  if (isNaN(amount)) amount = 0;
                  const value = data[GraphKey.value(denom)];
                  return (
                    <tr key={`tooltip-${label}-${k}`} className="p-0.5">
                      <th
                        className={
                          "flex items-center gap-1 p-0.5 px-2 text-start"
                        }
                        scope="row"
                      >
                        <ColoredDot i={i} />
                        <span>{denom}</span>
                      </th>
                      <td className="p-0.5 px-2 text-end">
                        {displayQuantity.format(amount)}
                      </td>
                      <td className="p-0.5 px-2 text-end">{`$${displayQuantity.format(value)}`}</td>
                    </tr>
                  );
                })}
          <tr className="p-0.5">
            <th
              className={"flex items-center gap-1 p-0.5 px-2 text-start"}
              scope="row"
            ></th>
            <td className="p-0.5 px-2 text-end"></td>
            <th className="p-0.5 px-2 text-end">
              {`$${displayQuantity.format(totalValue)}`}
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
