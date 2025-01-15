import { cn } from "../../utils";
import { HoverContent, WithIconAndTooltip } from "..";
import { cva, VariantProps } from "class-variance-authority";

const labelVariants = cva("text-nowrap", {
  variants: {
    size: {
      base: "text-base font-semibold pb-2 ",
      sm: "text-xs font-medium pb-1 ",
    },
    noGap: {
      true: "pb-0",
    },
  },
  defaultVariants: {
    size: "base",
  },
});
export interface InputLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  label: string; // text arg so it can be used for the tooltip too
  tooltipContent?: string;
  tooltipChildren?: React.ReactNode; // to give anything other than plaintext
}

export function InputLabel({
  label,
  tooltipContent,
  tooltipChildren,
  size,
  className,
  noGap,
}: InputLabelProps) {
  return (
    <div className={cn(labelVariants({ size, className, noGap }))}>
      <WithIconAndTooltip
        {...(tooltipContent && {
          tooltipContent: (
            <HoverContent
              className="max-w-lg"
              title={label}
              text={tooltipContent}
            >
              {tooltipChildren}
            </HoverContent>
          ),
        })}
      >
        {label}
      </WithIconAndTooltip>
    </div>
  );
}
