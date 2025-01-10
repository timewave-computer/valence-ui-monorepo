"use client";
import { cn } from "../utils";
import { InputLabel } from "./inputs";
import React, { Fragment, useId } from "react";

interface TableWriteableProps extends React.HTMLAttributes<HTMLDivElement> {
  headers: Array<{
    label: string;
    align?: "left" | "right" | "center";
  }>;
  children: React.ReactNode;
  messages?: Array<React.ReactNode>;
}

export const TableForm = ({
  headers,
  children,
  className,
  messages,
  ...props
}: TableWriteableProps) => {
  const gridTemplateColumns = `repeat(${headers.length}, auto)`;
  const tableId = useId(); // for unique key generation for multiple tables

  return (
    <div
      className={cn("grid gap-x-4 gap-y-2 w-fit", className)}
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

      <div className={cn("col-span-full flex flex-col gap-1")}>
        {messages?.map((message, index) => (
          <Fragment key={`${tableId}-message-${index}`}>{message}</Fragment>
        ))}
      </div>
    </div>
  );
};
