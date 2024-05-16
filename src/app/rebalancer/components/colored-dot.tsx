import { cn } from "@/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

/***
 * This is handled with CVA because generating with string interpolation fails to load color
 */
export const dotVariants = cva("h-2 w-2 rounded-full", {
  variants: {
    variant: {
      0: "bg-graph-red",
      1: "bg-graph-blue",
      2: "bg-graph-pink",
      3: "bg-graph-green",
      4: "bg-graph-orange",
      5: "bg-graph-brown",
      6: "bg-graph-gray",
      7: "bg-graph-yellow",
      8: "bg-graph-purple",
      9: "bg-graph-teal",
    },
  },
  defaultVariants: {
    variant: 1,
  },
});

export interface DotProps extends React.HTMLAttributes<HTMLDivElement> {
  i: number;
}

export const ColoredDot = ({ i }: DotProps) => {
  let variant: VariantProps<typeof dotVariants>["variant"];
  if (i <= 9) {
    variant = i as VariantProps<typeof dotVariants>["variant"];
  } else {
    variant = ((i - 1) % 10) + 1; // get circular index
  }
  return <div className={cn(dotVariants({ variant }))} />;
};
