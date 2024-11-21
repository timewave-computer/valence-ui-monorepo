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
    <button
      disabled={isDisabled}
      className={cn(
        isDisabled && "cursor-not-allowed",
        iconVariants({ variant }),
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
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
            className="flex min-h-16 min-w-36 flex-col items-center justify-center bg-valence-black"
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

export const TooltipContent: React.FC<{
  title?: string;
  text?: string;
  children?: ReactNode;
  className?: string;
}> = ({ title, text, children, className }) => {
  return (
    <div
      className={cn(
        "flex max-w-64 flex-col  items-start justify-start gap-2",
        className,
      )}
    >
      {(text || title) && (
        <div className="flex flex-col items-start justify-start gap-2">
          {title && <h3 className="text-left text-base font-bold">{title}</h3>}
          {text && (
            <p className="text-wrap  text-left text-sm font-normal">{text}</p>
          )}
        </div>
      )}
      {children && (
        <div className="text-left text-sm font-normal">{children}</div>
      )}
    </div>
  );
};
