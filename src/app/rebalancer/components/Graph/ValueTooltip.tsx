import { KeyTag, GraphKey, SymbolColors } from "@/app/rebalancer/const/graph";
import { cn, displayNumber, displayUtcTime } from "@/utils";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { ColoredDot } from "@/components";
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
        : k.includes(KeyTag.historicalValue);
    })
    .map((k) => {
      const denom = k.split(".")[0];

      const value = isProjection
        ? Number(data[GraphKey.projectedValue(denom)])
        : Number(data[GraphKey.historicalValue(denom)]);
      return value;
    })
    .reduce((acc: number, value: number) => {
      return acc + value;
    });

  return (
    <div className="flex  min-w-[300px] flex-col gap-3 border-[0.5px] border-valence-black bg-white  p-4">
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
            <AssetCell placeholderDot={true} symbol="Asset" />
            <HeaderCell className="text-end">Amount</HeaderCell>
            <HeaderCell className="text-end">Price</HeaderCell>
            <HeaderCell className="text-end">USD Value</HeaderCell>
          </TableRow>
        </thead>
        <tbody className="">
          {isProjection
            ? keys
                .filter((k) => k.includes(KeyTag.projectedValue))
                .map((k: string) => {
                  const symbol = k.split(".")[0];
                  let amount = data[GraphKey.projectedAmount(symbol)];
                  if (isNaN(amount)) amount = 0;
                  let value = data[GraphKey.projectedValue(symbol)];
                  if (isNaN(value)) value = 0;
                  const price = data[GraphKey.price(symbol)];

                  return (
                    <TableRow key={`tooltip-${label}-${k}`}>
                      <AssetCell symbol={symbol} />
                      <NumberCell className="text-end">
                        {displayNumber(amount, { precision: 2 })}
                      </NumberCell>
                      <NumberCell className="text-end">
                        {displayNumber(price, { precision: 2 })}
                      </NumberCell>
                      <NumberCell className="text-end">{`$${displayNumber(value, { precision: 2 })}`}</NumberCell>
                    </TableRow>
                  );
                })
            : keys
                .filter((k) => k.includes(KeyTag.historicalValue))
                .map((k: string, i: number) => {
                  const symbol = k.split(".")[0];
                  let amount = data[GraphKey.historicalAmount(symbol)];
                  if (isNaN(amount)) amount = 0;
                  const value = data[GraphKey.historicalValue(symbol)];
                  const price = data[GraphKey.price(symbol)];
                  return (
                    <TableRow key={`tooltip-${label}-${k}`}>
                      <AssetCell symbol={symbol} />
                      <NumberCell className="text-end">
                        {displayNumber(amount, { precision: 2 })}
                      </NumberCell>
                      <NumberCell className="text-end">
                        {displayNumber(price, { precision: 2 })}
                      </NumberCell>
                      <NumberCell className="text-end">{`$${displayNumber(value, { precision: 2 })}`}</NumberCell>
                    </TableRow>
                  );
                })}
          <TableRow className="border-t-[0.5px] border-valence-gray">
            <AssetCell placeholderDot={true} symbol="Total" />
            <TextCell></TextCell>
            <TextCell></TextCell>

            <NumberCell className="text-end">{`$${displayNumber(totalValue, { precision: 2 })}`}</NumberCell>
          </TableRow>
        </tbody>
      </table>
    </div>
  );
};

const AssetCell: React.FC<{ symbol: string; placeholderDot?: boolean }> = ({
  symbol,
  placeholderDot = false,
}) => {
  return (
    <TextCell
      className="flex items-center  justify-start gap-1 text-xs"
      asHeading={true}
    >
      {placeholderDot ? (
        <ColoredDot variant="placeholder" />
      ) : (
        <ColoredDot variant={SymbolColors.get(symbol)} />
      )}

      <span>{symbol}</span>
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
  const style = cn(" text-center font-mono py-0.5 text-xs px-3", className);
  if (asHeading)
    return (
      <th className={style} scope="row">
        {children}
      </th>
    );
  return <td className={style}>{children}</td>;
};
