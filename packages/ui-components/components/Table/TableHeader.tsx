import { cn } from "../../utils";
import React, { Dispatch, SetStateAction } from "react";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { WithIconAndTooltip } from "../WithIconAndTooltip";
import { cva, VariantProps } from "class-variance-authority";

const tableHeaderVariants = cva(
  "flex flex-row  gap-2 text-nowrap  outline-none items-center",
  {
    variants: {
      variant: {
        primary: "border-y border-valence-black py-4 px-3",
        secondary: "py-2 px-2",
      },
      align: {
        left: " justify-start",
        center: "justify-center",
        right: "justify-end",
      },
    },
    defaultVariants: {
      variant: "primary",
      align: "center",
    },
  },
);

export type HeaderVariants = VariantProps<typeof tableHeaderVariants>;

const headerTextVariants = cva("text-nowrap text-sm font-semibold", {
  variants: {
    variant: {
      primary: "text-sm",
      secondary: "text-xs",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type Sorter<T, K> = {
  key: K;
  sort: (a: T, b: T, ascending: boolean) => number;
};

type HeaderProps<T, K> = {
  /**
   * The label of the header.
   */
  label: string;
  /**
   * The sorter key.
   */
  sorterKey?: string;
  /**
   * The currently selected sorter.
   */
  currentSorter?: Sorter<T, K>;
  /**
   * Whether or not sorter is ascending.
   */
  ascending: boolean;
  /**
   * Set the current sorter.
   */
  setSorter?: Dispatch<SetStateAction<string>>;
  /**
   * Set whether or not sorter is ascending.
   */
  setSortAscending?: Dispatch<SetStateAction<boolean>>;

  /***
   * An optional hover tooltip.
   */
  hoverTooltip?: React.ReactNode;
  /**
   * The variant of the header.
   */
  variant?: HeaderVariants["variant"];
  /**
   * The alignment of the header.
   */
  align?: HeaderVariants["align"];
};

export interface SortableTableHeaderProps<T, K>
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    HeaderProps<T, K> {}

export const TableHeader = <T, K>({
  label,
  sorterKey,
  currentSorter,
  ascending,
  setSorter,
  setSortAscending,
  hoverTooltip,
  variant = "primary",
  align = "center",
  className,
}: SortableTableHeaderProps<T, K>) => {
  const SortIcon = ascending ? BsCaretUpFill : BsCaretDownFill;
  const isSortable =
    sorterKey && currentSorter && setSortAscending && setSorter;
  const isSortArrowVisible = currentSorter?.key === sorterKey;
  const Comp = isSortable ? "button" : "div";

  return (
    <Comp
      className={cn(tableHeaderVariants({ variant, align }), className)}
      {...(isSortable && {
        onClick: () => {
          if (!sorterKey || !currentSorter || !setSortAscending || !setSorter)
            return;

          if (currentSorter.key === sorterKey) {
            setSortAscending((a) => !a);
          } else {
            setSorter(sorterKey);
            setSortAscending(true);
          }
        },
      })}
    >
      <WithIconAndTooltip
        className="items-top flex flex-row justify-end gap-0.5"
        side="top"
        tooltipContent={hoverTooltip}
      >
        <span className={cn(headerTextVariants({ variant }))}>{label}</span>
      </WithIconAndTooltip>

      {isSortArrowVisible && <SortIcon className="w-4 h-4" />}
    </Comp>
  );
};
