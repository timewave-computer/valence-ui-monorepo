import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";

const variants = cva("flex items-center text-sm font-medium tracking-wide", {
  variants: {
    variant: {
      info: "text-valence-gray",
      warn: "text-warn",
      error: "text-valence-red",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

interface WarnTextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof variants> {
  text: string;
}
export const WarnTextV2: React.FC<WarnTextProps> = ({ text, variant }) => {
  return <span className={cn(variants({ variant }))}>{text}</span>;
};
