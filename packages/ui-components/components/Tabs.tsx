"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../utils";
import { cva, VariantProps } from "class-variance-authority";

const TabsRoot = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-start border-valence-black border-l border-y ",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center  py-1.5 px-3 min-h-9 text-base transition-all border-r border-valence-black    ",
      "focus-visible:bg-valence-black focus-visible:text-valence-white  disabled:bg-valence-mediumgray  ",
      "data-[state=active]:bg-valence-black data-[state=active]:text-valence-white ",

      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const tabContentVariants = cva(
  "data-[state=inactive]:hidden mt-2  overflow-scroll",
  {
    variants: {
      variant: {
        primary:
          " border-valence-black data-[state=active]:border border bg-valence-white p-4",
        secondary: "border-0 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  VariantProps<typeof tabContentVariants> &
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabContentVariants({ variant, className }))}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { TabsRoot, TabsList, TabsTrigger, TabsContent };
