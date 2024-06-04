import { KeyTag, GraphKey } from "@/app/rebalancer/const/graph";
import { cn, displayQuantity, displayUtcTime } from "@/utils";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { ColoredDot } from "@/app/rebalancer/components";
import { ReactNode } from "react";

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
    <div className="flex flex-col gap-3 border-[0.5px] border-valence-black bg-white p-4">
      <div className="flex items-start justify-between px-2">
        <div className="self-start text-lg font-semibold">
          {isProjection ? "Projected" : "Balances"}
        </div>
        <div className="flex flex-col items-end gap-0.5 text-xs font-light tracking-tight">
          <span>
            {date.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
          </span>
          <span>{displayUtcTime(date)}</span>{" "}
        </div>
      </div>
      <table className="">
        <thead className="">
          <TableRow>
            <HeaderCell>Asset</HeaderCell>
            <HeaderCell className="text-end">Amount</HeaderCell>
            <HeaderCell className="text-end">USD Value</HeaderCell>
          </TableRow>
        </thead>
        <tbody className="">
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
                    <TableRow key={`tooltip-${label}-${k}`}>
                      <AssetCell i={i} denom={denom} />
                      <NumberCell className="text-end">
                        {displayQuantity.format(amount)}
                      </NumberCell>
                      <NumberCell className="text-end">{`$${displayQuantity.format(value)}`}</NumberCell>
                    </TableRow>
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
                    <TableRow key={`tooltip-${label}-${k}`}>
                      <AssetCell i={i} denom={denom} />
                      <NumberCell className="text-end">
                        {displayQuantity.format(amount)}
                      </NumberCell>
                      <NumberCell className="text-end">{`$${displayQuantity.format(value)}`}</NumberCell>
                    </TableRow>
                  );
                })}
          <TableRow className="border-t-[0.5px] border-valence-gray">
            <HeaderCell className="py-1.5 text-xs">Total</HeaderCell>
            <TextCell></TextCell>
            <NumberCell className="text-end">{`$${displayQuantity.format(totalValue)}`}</NumberCell>
          </TableRow>
        </tbody>
      </table>
    </div>
  );
};

const AssetCell: React.FC<{ i: number; denom: string }> = ({ i, denom }) => {
  return (
    <TextCell
      className="flex items-center  justify-center gap-1 text-xs"
      asHeading={true}
    >
      <ColoredDot i={i} />
      <span>{denom}</span>
    </TextCell>
  );
};
const TableRow: React.FC<{ className?: string; children?: ReactNode }> = ({
  className,
  children,
}) => {
  return <tr className={cn("", className)}>{children}</tr>;
};

const HeaderCell: React.FC<{ className?: string; children?: ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <th className={cn("px-3 py-0.5 text-xs", className)} scope="col">
      {children}
    </th>
  );
};

const TextCell: React.FC<{
  className?: string;
  children?: ReactNode;
  asHeading?: boolean;
}> = ({ className, children, asHeading }) => {
  const style = cn("text-center py-0.5 text-sm px-3", className);
  if (asHeading)
    return (
      <th className={style} scope="col">
        {children}
      </th>
    );

  return (
    <td className={style} scope="col">
      {children}
    </td>
  );
};

const NumberCell: React.FC<{
  className?: string;
  children?: ReactNode;
  asHeading?: boolean;
}> = ({ children, className, asHeading }) => {
  const style = cn(" text-center font-mono py-0.5 text-sm px-3", className);
  if (asHeading)
    return (
      <th className={style} scope="row">
        {children}
      </th>
    );
  return <td className={style}>{children}</td>;
};
