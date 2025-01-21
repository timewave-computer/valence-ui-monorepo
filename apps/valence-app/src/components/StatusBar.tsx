import { VariantProps, cva } from "class-variance-authority";
import React, { ReactNode } from "react";
import { IconType } from "react-icons/lib";
import { LoadingIndicator, cn } from "@valence-ui/ui-components";

const statusBarVariants = cva("  py-3 px-5 transition-all font-sans ", {
  variants: {
    variant: {
      primary: " bg-valence-black text-valence-white ",
      error: "bg-valence-red text-valence-white  ",
      loading:
        "min-h-[58px]  bg-valence-black text-valence-white flex flex-col  justify-center",
    },
  },
});

export interface StatusBarProps
  extends React.HTMLAttributes<HTMLDivElement | HTMLButtonElement>,
    VariantProps<typeof statusBarVariants> {
  text?: string;
  icon?: ReactNode;
  asButton?: boolean;
}
type SizedIconType = IconType & { size?: number };

export const StatusBar: React.FC<StatusBarProps> = ({
  text,
  icon,
  className,
  variant,
  asButton,
  ...props
}) => {
  const sizedIcon = React.isValidElement<SizedIconType>(icon)
    ? React.cloneElement(icon, { size: 20 })
    : icon;

  const Comp = asButton ? "button" : "div";
  return (
    <Comp className={cn(statusBarVariants({ variant, className }))} {...props}>
      <div
        className={cn(
          "flex  min-w-56 flex-row items-center justify-center overflow-hidden",
          icon ? "gap-4" : "",
        )}
      >
        <div>{sizedIcon}</div>
        {variant === "loading" ? (
          <LoadingIndicator />
        ) : (
          <span className="text-wrap text-center text-h2">{text}</span>
        )}
      </div>
    </Comp>
  );
};
