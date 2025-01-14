import { cva, VariantProps } from "class-variance-authority";
import { Fragment } from "react";
import { cn } from "../../utils";

const dotVariants = cva("shrink-0 rounded-full bg-valence-gray", {
  variants: {
    size: {
      base: "h-4 w-4",
      sm: "h-3 w-3",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

const assetVariants = cva("font-bold", {
  variants: {
    size: {
      base: "text-sm",
      sm: "text-xs",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

interface AssetVariants extends VariantProps<typeof assetVariants> {
  symbol?: string;
  color?: string;
  asChild?: boolean;
}

export const Asset: React.FC<AssetVariants> = ({
  symbol,
  asChild = false,
  color,
  size,
}) => {
  const AssetWithDot = (
    <>
      <div
        className={cn(dotVariants({ size }))}
        style={{
          backgroundColor: color ?? "",
        }}
      ></div>
      <span className={cn(assetVariants({ size }))}>{symbol ?? ""}</span>
    </>
  );

  if (asChild) {
    return <Fragment> {AssetWithDot}</Fragment>;
  }

  return <div className="flex flex-row items-center gap-2">{AssetWithDot}</div>;
};
