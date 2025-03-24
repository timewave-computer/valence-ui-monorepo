import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils";
import { ReactNode } from "react";

const labelVariants = cva(
  "h-fit w-fit px-1.5 py-0.5 text-xs text-center font-mono",
  {
    variants: {
      variant: {
        green: "bg-valence-green text-valence-black",
        yellow: "bg-valence-yellow text-valence-black",
        red: "bg-valence-red text-valence-white",
        gray: "bg-valence-mediumgray text-valence-black",
        purple: "bg-graph-purple text-valence-white",
        teal: "bg-graph-teal text-valence-white",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

export interface LabelProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof labelVariants> {
  children: ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  variant,
  className,
  children,
  ...props
}) => {
  return (
    <span {...props} className={cn(labelVariants({ variant, className }))}>
      {capitalizeText(children)}
    </span>
  );
};

const capitalizeText = (text: React.ReactNode) => {
  if (typeof text === "string") {
    return text.toUpperCase();
  }
  return text;
};
