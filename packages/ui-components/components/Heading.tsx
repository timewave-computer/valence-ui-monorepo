import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const headingVariants = cva("", {
  variants: {
    level: {
      h1: "text-h1 font-semibold",
      h2: "text-h2 font-semibold",
      h3: "text-h3 font-semibold ",
      h4: "text-h4 font-semibold  ",
      h5: "text-h5 font-semibold   ",
      h6: "text-h6 font-semibold  ",
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
  children: React.ReactNode;
}

export const Heading = ({ level, className = "", children }: HeadingProps) => {
  const _level = level ?? "h1";
  const Tag = _level; // Dynamically decide the heading level (h1, h2, etc.)
  return (
    <Tag className={cn(headingVariants({ level }), className)}>{children}</Tag>
  );
};

export default Heading;
