import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "../utils";
import { InfoText } from "./InfoText";

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

export interface CalloutBoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutBoxVariants> {
  children?: React.ReactNode;
  title: string;
}

export const CalloutBox = React.forwardRef<HTMLDivElement, CalloutBoxProps>(
  ({ className, variant, title, children, ...props }, ref) => {
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
          <InfoText size="lg" variant={variant}>
            {title}
          </InfoText>
        </div>
        <div className="flex flex-col gap-2 text-sm">{children}</div>
      </div>
    );
  },
);
CalloutBox.displayName = "CalloutBox";
