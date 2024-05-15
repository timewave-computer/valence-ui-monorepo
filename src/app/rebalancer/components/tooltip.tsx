import { KeyTag, COLORS, GraphKey } from "@/app/rebalancer/const/graph";
import { cn, displayNumber } from "@/utils";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

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

  return (
    <div className="flex flex-col gap-2 bg-white p-4">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-semibold">
          {isProjection ? "Projected" : "Rebalance Activity"}
        </div>
        <div className="text"> {date.toLocaleDateString()}</div>
      </div>

      <table>
        <thead>
          <tr className="p-1">
            <th className="wrap-text max-w-16 px-2 text-start" scope="col">
              Asset
            </th>
            <th className="wrap-text max-w-16 px-2 text-start" scope="col">
              Amount
            </th>
            <th className="wrap-text max-w-16 px-2 text-start" scope="col">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {isProjection
            ? keys
                .filter((k) => k.includes(KeyTag.projectedValue))
                .map((k: string, i: number) => {
                  const color = `bg-[${COLORS[i]}]`;
                  const denom = k.split(".")[0];
                  const amount = data[GraphKey.projectedAmount(denom)];
                  const value = data[GraphKey.projectedValue(denom)];
                  return (
                    <tr key={`tooltip-${label}-${k}`} className="p-0.5">
                      <th
                        className={
                          "flex items-center gap-1 p-0.5 px-2 text-start"
                        }
                        scope="row"
                      >
                        <div className={cn("h-2 w-2 rounded-full", color)} />
                        <span>{denom}</span>
                      </th>
                      <td className="p-0.5 px-2 text-end">
                        {displayNumber.format(amount)}
                      </td>
                      <td className="p-0.5 px-2 text-end">{`$${displayNumber.format(value)}`}</td>
                    </tr>
                  );
                })
            : keys
                .filter((k) => k.includes(KeyTag.value))
                .map((k: string, i: number) => {
                  const color = `bg-[${COLORS[i]}]`;
                  const denom = k.split(".")[0];
                  const amount = data[GraphKey.balance(denom)];
                  const value = data[GraphKey.value(denom)];

                  return (
                    <tr key={`tooltip-${label}-${k}`} className="p-0.5">
                      <th
                        className={
                          "flex items-center gap-1 p-0.5 px-2 text-start"
                        }
                        scope="row"
                      >
                        <div
                          className={cn("h-2 w-2 rounded-full text-end", color)}
                        />
                        <span>{denom}</span>
                      </th>
                      <td className="p-0.5 px-2 text-end">
                        {displayNumber.format(amount)}
                      </td>
                      <td className="p-0.5 px-2 text-end">{`$${displayNumber.format(value)}`}</td>
                    </tr>
                  );
                })}
        </tbody>
      </table>
    </div>
  );
};
