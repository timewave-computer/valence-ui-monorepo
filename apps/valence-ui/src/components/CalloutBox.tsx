import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { WarnTextV2 } from "@/app/rebalancer/create/components";
import { BsExclamationCircle } from "react-icons/bs";
import { cn } from "@/utils";

const calloutBoxVariants = cva("", {
  variants: {
    variant: {
      warn: "border-warn",
      info: "border-valence-gray",
      error: "border-valence-red",
    },
  },
  defaultVariants: {
    variant: "warn",
  },
});

const iconVariants = cva("", {
  variants: {
    variant: {
      warn: "text-warn",
      info: "text-valence-gray",
      error: "text-valence-red",
    },
  },
  defaultVariants: {
    variant: "warn",
  },
});

export interface CalloutBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutBoxVariants> {
  children?: React.ReactNode;
  text?: string;
  title: string;
  Icon?: React.ElementType;
}

export const CalloutBox = React.forwardRef<HTMLDivElement, CalloutBoxProps>(
  (
    {
      className,
      variant,
      text,
      title,
      children,
      Icon = BsExclamationCircle,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "mt-2 flex flex-col gap-2 border p-4",
          className,
          calloutBoxVariants({ variant }),
        )}
      >
        <div className="flex items-center gap-2 ">
          <Icon className={cn("h-5 w-5", iconVariants({ variant }))} />
          <WarnTextV2
            className="text-base font-semibold tracking-wide"
            variant={variant}
            text={title}
          />
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {text && <p>{text}</p>}
          {children}
        </div>
      </div>
    );
  },
);
CalloutBox.displayName = "CalloutBox";
