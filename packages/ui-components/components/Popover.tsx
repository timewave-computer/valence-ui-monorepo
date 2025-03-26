"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../utils";

type PopoverRootProps = React.ComponentProps<typeof PopoverPrimitive.Root>;
export const PopoverRoot = ({ children, ...props }: PopoverRootProps) => {
  return <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>;
};

export const PopoverTrigger = PopoverPrimitive.Trigger;

type PopoverContentProps = React.ComponentProps<
  typeof PopoverPrimitive.Content
>;
export const PopoverContent = ({
  className,
  children,
  sideOffset,
  ...props
}: PopoverContentProps) => {
  return (
    <PopoverPrimitive.Content
      {...props}
      sideOffset={sideOffset ?? 10}
      className={cn(
        "p-4 bg-valence-white border border-valence-black shadow-sm shadow-valence-gray min-w-44 text-sm flex flex-col gap-2 z-50",
        className,
      )}
    >
      {children}
    </PopoverPrimitive.Content>
  );
};
