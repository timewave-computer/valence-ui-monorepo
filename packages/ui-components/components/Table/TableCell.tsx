import { cn } from "../../utils";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { cva } from "class-variance-authority";
import { HeaderVariants } from "./TableHeader";
import { CellLink } from "./cell-types";

const tableCellVariants = cva(
  "flex  min-h-12 items-center justify-center  py-2 font-mono  text-xs  text-nowrap ",
  {
    variants: {
      variant: {
        primary: "border-b border-valence-mediumgray px-4",
        secondary: "px-3",
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

interface TableCellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string | React.ReactNode;
  isLoading?: boolean;
  variant?: HeaderVariants["variant"];
  align?: HeaderVariants["align"];
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
      <div className={cn(tableCellVariants({ variant, align, className }))}>
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
