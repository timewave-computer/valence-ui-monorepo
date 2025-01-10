"use client";
import { cn } from "../utils";
import { InputLabel } from "./inputs";
import { useId } from "react";

interface TableWriteableProps extends React.HTMLAttributes<HTMLDivElement> {
  headers: Array<{
    label: string;
    align?: "left" | "right" | "center";
  }>;
  children: React.ReactNode;
}
export const TableWriteable = ({
  headers,
  children,
  className,
  ...props
}: TableWriteableProps) => {
  const gridTemplateColumns = `repeat(${headers.length}, auto)`;
  const tableId = useId(); // for unique key generation for multiple tables

  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-2 w-fit",
        gridTemplateColumns,
        className,
      )}
      {...props}
      style={{ gridTemplateColumns }}
    >
      {headers.map((header) => {
        return (
          <InputLabel
            key={`${tableId}${header.label}`}
            noGap
            size="sm"
            label={header.label}
          />
        );
      })}
      {children}
    </div>
  );
};
