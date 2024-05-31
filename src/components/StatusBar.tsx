import { cn } from "@/utils";
import { VariantProps, cva } from "class-variance-authority";
import React, { ReactNode } from "react";
import { IconType } from "react-icons/lib";

const statusBarVariants = cva(
  "border-[1px]  bg-valence-white py-3 px-6 font-semibold",
  {
    variants: {
      variant: {
        error: "border-valence-red text-valence-red  ",
        loading: "min-h-[46px] animate-pulse bg-white border-valence-gray",
        info: "border-valence-black text-valence-black ",
      },
    },
  },
);

export interface StatusBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBarVariants> {
  text: string;
  icon?: ReactNode;
}
type SizedIconType = IconType & { size?: number };

export const StatusBar: React.FC<StatusBarProps> = ({
  text,
  icon,
  className,
  variant,
  ...props
}) => {
  const sizedIcon = React.isValidElement<SizedIconType>(icon)
    ? React.cloneElement(icon, { size: 20 })
    : icon;

  return (
    <div className={cn(statusBarVariants({ variant, className }))} {...props}>
      <div
        className={cn(
          "flex min-w-56 flex-row items-center justify-center overflow-hidden",
          icon ? "gap-4" : "",
        )}
      >
        <div>{sizedIcon}</div>
        <span className="text-wrap text-center">{text}</span>
      </div>
    </div>
  );
};
