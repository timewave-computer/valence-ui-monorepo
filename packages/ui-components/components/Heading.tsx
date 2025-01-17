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
      h7: "text-base font-semibold  ",
      h8: "text-sm font-semibold  ",
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
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "h7" | "h8";
}

export const Heading = ({ level, className = "", children }: HeadingProps) => {
  const _level = level ?? "h1";

  // TODO: this can be removed once headers are bumped
  if (level === "h7" || level === "h8") {
    return (
      <div className={cn(headingVariants({ level, className }))}>
        {children}
      </div>
    );
  }

  // type cast just temporary until headers are bumped
  const Tag = _level as "h1" | "h2"; // Dynamically decide the heading level (h1, h2, etc.)

  return (
    <Tag className={cn(headingVariants({ level, className }))}>{children}</Tag>
  );
};

export default Heading;
