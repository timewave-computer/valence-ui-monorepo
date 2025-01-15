"use client";
import React, { ReactNode } from "react";
import { LoadingIndicator, Tooltip, TooltipContent, TooltipTrigger } from ".";
import { BsQuestion } from "react-icons/bs";
import { cn } from "../utils";
import { cva, VariantProps } from "class-variance-authority";

const iconVariants = cva(
  " flex h-4 w-4 flex-col items-center justify-center rounded-full  transition-all ",
  {
    variants: {
      variant: {
        info: "bg-valence-lightgray text-valence-gray hover:bg-valence-mediumgray hover:text-valence-black  ",
        error: "bg-valence-mediumred hover:bg-valence-red text-valence-white",
        warn: "bg-warn/80 hover:bg-warn text-valence-white",
      },
      defaultVariants: {
        variant: "info",
      },
    },
  },
);

export interface WithIconAndTooltipProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof iconVariants> {
  children?: ReactNode;
  tooltipContent?: ReactNode;
  side?: "right" | "left" | "top" | "bottom";
  className?: string;
  Icon?: React.ElementType;
  isDisabled?: boolean;
  isLoading?: boolean;
  isServer?: boolean;
}
/**
 * Wraps children in component that displays an icon with a tooltip on hover.
 * If no children supplied, the icon is still displayed.
 */
export const WithIconAndTooltip: React.FC<WithIconAndTooltipProps> = ({
  children,
  tooltipContent,
  side = "right",
  className,
  Icon = BsQuestion,
  variant = "info",
  isDisabled = false,
  isLoading = false,
  isServer,
}) => {
  if (!tooltipContent) {
    return <>{children}</>;
  }
  const containerClassname = cn("flex flex-row  gap-1 items-center", className);
  const _button = (
    <div
      className={cn(
        isDisabled && "cursor-not-allowed",
        iconVariants({ variant }),
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
  );

  if (isDisabled) {
    return (
      <div className={containerClassname}>
        {children}
        {_button}
      </div>
    );
  }
  if (isLoading || isServer) {
    return (
      <div className={containerClassname}>
        {children}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{_button}</TooltipTrigger>
          <TooltipContent
            className="flex max-w-xl flex-col items-center justify-center "
            side={side}
          >
            <LoadingIndicator />
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={containerClassname}>
      {children}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{_button}</TooltipTrigger>
        <TooltipContent side={side}>{tooltipContent}</TooltipContent>
      </Tooltip>
    </div>
  );
};
