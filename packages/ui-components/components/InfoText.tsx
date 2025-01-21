import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { BsExclamationCircle, BsXCircle, BsInfoCircle } from "react-icons/bs";
import { cn } from "../utils";

const infoTextVariants = cva("flex flex-row gap-2 items-center text-sm", {
  variants: {
    variant: {
      warn: "border-warn text-warn",
      info: "border-valence-gray",
      error: "border-valence-red text-valence-red",
    },
    size: {
      base: "text-sm",
      lg: "text-h3 font-semibold",
    },
  },
  defaultVariants: {
    variant: "warn",
    size: "base",
  },
});

const iconVariants = cva("", {
  variants: {
    variant: {
      warn: "text-warn",
      info: "text-valence-gray",
      error: "text-valence-red",
    },
    size: {
      base: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: {
    variant: "warn",
  },
});

type InfoTextVariants = VariantProps<typeof infoTextVariants>;

export interface InfoTextProps
  extends React.HTMLAttributes<HTMLDivElement>,
    InfoTextVariants {
  children?: React.ReactNode;
}

const icons: Record<keyof InfoTextVariants["variant"], React.ComponentType> = {
  warn: BsExclamationCircle,
  info: BsInfoCircle,
  error: BsXCircle,
};

export const InfoText = React.forwardRef<HTMLDivElement, InfoTextProps>(
  ({ className, variant = "info", children, size, ...props }, ref) => {
    const Icon = icons[variant as keyof typeof icons] as React.ComponentType<{
      className?: string;
    }>;
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex flex-row gap-2",
          className,
          infoTextVariants({ variant, size }),
        )}
      >
        <Icon className={cn(iconVariants({ variant, size }))} />
        <div>{children}</div>
      </div>
    );
  },
);
InfoText.displayName = "InfoText";
