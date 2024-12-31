import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const headingVariants = cva("", {
  variants: {
    level: {
      h1: "text-h1 font-bold",
      h2: "text-h2 font-bold",
      h3: "text-h3 font-bold ",
      h4: "text-h4 font-bold",
      h5: "text-h5 font-bold",
      h6: "text-h6 font-bold",
    },
  },
  defaultVariants: {
    level: "h1",
  },
});
interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  className?: string;
}

export const Heading = ({ level, className = "" }: HeadingProps) => {
  const _level = level ?? "h1";
  const Tag = _level; // Dynamically decide the heading level (h1, h2, etc.)
  return <Tag className={cn(headingVariants({ level }), className)} />;
};

export default Heading;
