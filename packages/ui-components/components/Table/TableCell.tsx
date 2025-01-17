import { LoadingSkeleton } from "../LoadingSkeleton";
import { cva, VariantProps } from "class-variance-authority";
import { CellLink } from "./cell-types";

const tableCellVariants = cva(
  "flex items-center justify-center  py-2 font-mono  text-xs  text-nowrap w-full ",
  {
    variants: {
      variant: {
        primary: "border-b min-h-12 border-valence-mediumgray px-3",
        secondary: "px-2 min-h-9",
        input: "p-0 min-h-9",
      },
      isLink: {
        true: "underline decoration-valence-lightgray decoration-[1px] underline-offset-4 hover:decoration-valence-gray",
      },
      align: {
        left: "!justify-start",
        right: "!justify-end",
        center: "!justify-center",
      },
      isError: {
        true: "!text-valence-red",
      },
      isLastRow: {
        true: "!border-b-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      align: "left",
    },
  },
);

export type TableCellVariants = VariantProps<typeof tableCellVariants>;

interface TableCellProps
  extends React.ButtonHTMLAttributes<HTMLElement>,
    VariantProps<typeof tableCellVariants> {
  children?: string | React.ReactNode;
  isLoading?: boolean;
  link?: CellLink;
}

export const TableCell = ({
  children,
  className,
  isLoading,
  link,
  isError,
  isLastRow,
  variant = "primary",
  align,
}: TableCellProps) => {
  const isLink = !!link;
  const cellClasses = tableCellVariants({
    variant,
    align,
    isLink,
    isError,
    isLastRow,
    className,
  });
  if (isLoading)
    return (
      <div role="gridcell" className={cellClasses}>
        <LoadingSkeleton className="h-full w-full" />
      </div>
    );
  else if (isLink) {
    const Comp = link.LinkComponent ?? "a";
    return (
      <Comp
        role="gridcell"
        href={link.href}
        target={link.blankTarget ?? true ? "_blank" : undefined} // nullish operator. If link.blankTarget is null or undefined, it will default to true
        className={cellClasses}
      >
        <>{children}</>
      </Comp>
    );
  } else
    return (
      <div role="gridcell" className={cellClasses}>
        <>{children}</>
      </div>
    );
};
