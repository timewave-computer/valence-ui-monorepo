import React from "react";
import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import LoadingSkeleton from "@/components/LoadingSkeleton";

const inputTableCellVariants = cva("flex w-full items-center justify-start  ", {
  variants: {
    variant: {
      unstyled: "",
      number: "font-mono font-light min-h-11",
      header: "h-fit text-xs font-medium flex text-nowrap",
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

export const InputTableCell: React.FC<InputTableCellProps> = ({
  children,
  isLoading,
  variant,
  className,
  ...props
}) => {
  return (
    <div
      role="gridcell"
      {...props}
      className={cn(inputTableCellVariants({ variant, className }))}
    >
      {isLoading ? <LoadingSkeleton className="min-h-12" /> : children}
    </div>
  );
};
