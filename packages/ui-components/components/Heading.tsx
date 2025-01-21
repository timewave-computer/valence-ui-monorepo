import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const headingVariants = cva("", {
  variants: {
    level: {
      h1: "text-h1 font-semibold",
      h2: "text-h2 font-semibold",
      h3: "text-h3 font-semibold ",
      h4: "text-base font-semibold  ",
      h5: "text-sm font-semibold  ",
      h6: "text-xs font-semibold  ",
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
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = ({ level, className = "", children }: HeadingProps) => {
  const Tag = level ?? "h1";
  return (
    <Tag className={cn(headingVariants({ level, className }))}>{children}</Tag>
  );
};

export default Heading;
