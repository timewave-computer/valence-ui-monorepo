import { cn } from "../../utils";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { cva, VariantProps } from "class-variance-authority";
import { CellLink } from "./cell-types";

const tableCellVariants = cva(
  "flex   items-center justify-center  py-2 font-mono  text-xs  text-nowrap w-full ",
  {
    variants: {
      variant: {
        primary: "border-b min-h-12 border-valence-mediumgray px-3",
        secondary: "px-2 min-h-9",
        input: "p-0 min-h-9",
      },
      link: {
        true: "underline decoration-valence-lightgray decoration-[1px] underline-offset-4 hover:decoration-valence-gray",
      },
      align: {
        left: "justify-start",
        right: "justify-end",
        center: "justify-center",
      },
    },
    defaultVariants: {
      variant: "primary",
      link: false,
    },
  },
);

export type TableCellVariants = VariantProps<typeof tableCellVariants>;

interface TableCellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string | React.ReactNode;
  isLoading?: boolean;
  variant?: TableCellVariants["variant"];
  align?: TableCellVariants["align"];
  link?: CellLink;
}

export const TableCell = ({
  children,
  className,
  isLoading,
  link,
  variant = "primary",
  align = "center",
}: TableCellProps) => {
  if (!link?.href)
    return (
      <div
        role="gridcell"
        className={cn(tableCellVariants({ variant, align, className }))}
      >
        {isLoading ? (
          <LoadingSkeleton className="h-full w-full" />
        ) : (
          <>{children}</>
        )}
      </div>
    );

  const Comp = link?.LinkComponent ?? "a";

  return (
    <Comp
      role="gridcell"
      href={link?.href}
      {...(link?.blankTarget ? { target: "_blank" } : {})}
      className={cn(tableCellVariants({ variant, link: !!link, className }))}
    >
      {isLoading ? (
        <LoadingSkeleton className="h-full w-full" />
      ) : (
        <>{children}</>
      )}
    </Comp>
  );
};
