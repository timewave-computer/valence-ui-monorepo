import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";

const statusCellVariants = cva(
  "font-semibold h-fit w-fit min-w-16 px-1 py-0.5 text-center",
  {
    variants: {
      variant: {
        green: "bg-valence-green text-valence-white",
        yellow: "bg-valence-yellow text-valence-black",
        gray: "bg-valence-lightgray text-valence-black",
      },
    },
    defaultVariants: {
      variant: "gray",
    },
  },
);

export interface StatusCellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusCellVariants> {
  children?: string;
  className?: string;
}

export type StatusCellVariant = typeof statusCellVariants;

export const StatusCell = ({
  children,
  className,
  variant,
}: StatusCellProps) => {
  return (
    <div
      className={cn(
        "flex justify-center px-1 py-2 font-mono text-xxs",
        "border-x border-valence-lightgray",
        className,
      )}
    >
      <div className={cn(statusCellVariants({ variant }))}>{children}</div>
    </div>
  );
};
