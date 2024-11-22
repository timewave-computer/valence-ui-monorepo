import React, { forwardRef } from "react";
import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LoadingSkeleton } from "@/components";

const inputTableCellVariants = cva("flex w-full items-center justify-start  ", {
  variants: {
    variant: {
      unstyled: "",
      number: "font-mono font-light min-h-11",
      header: "h-fit",
    },
  },
  defaultVariants: {
    variant: "number",
  },
});

export interface InputTableCellProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof inputTableCellVariants> {
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const InputTableCell = forwardRef<HTMLDivElement, InputTableCellProps>(
  ({ children, isLoading, variant, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="gridcell"
        {...props}
        className={cn(inputTableCellVariants({ variant, className }))}
      >
        {isLoading ? <LoadingSkeleton className="min-h-12" /> : children}
      </div>
    );
  },
);
