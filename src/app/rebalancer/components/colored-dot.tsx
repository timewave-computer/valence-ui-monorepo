import { cn } from "@/utils";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

/***
 * This is handled with CVA because generating with string interpolation fails to load color
 */
export const dotVariants = cva("h-2 w-2 rounded-full", {
  variants: {
    variant: {
      "#FF2A00": "bg-graph-red",
      "#00A3FF": "bg-graph-blue",
      "#EA80D1": "bg-graph-pink",
      "#4EBB5B": "bg-graph-green",
      "#FFBC57": "bg-graph-orange",
      "#800000": "bg-graph-brown",
      "#BABABA": "bg-graph-gray",
      "#C2C600": "bg-graph-yellow",
      "#8476DE": "bg-graph-purple",
      "#17CFCF": "bg-graph-teal",
    },
  },
  defaultVariants: {
    variant: "#FF2A00",
  },
});

export interface DotProps extends VariantProps<typeof dotVariants> {}

export const ColoredDot = ({ variant }: DotProps) => {
  return <div className={cn(dotVariants({ variant }))} />;
};
