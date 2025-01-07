import { cn } from "../../utils";
import React, { Dispatch, SetStateAction } from "react";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { WithIconAndTooltip } from "../WithIconAndTooltip";
import { cva } from "class-variance-authority";
import { TableVariants } from "./Table";

const tableHeaderVariants = cva(
  "flex flex-row items-center gap-2 text-nowrap  outline-none",
  {
    variants: {
      variant: {
        primary: "border-y border-valence-black p-4",
        secondary: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

const headerTextVariants = cva("text-nowrap text-sm font-bold", {
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
  variant: TableVariants;
};

export interface SortableTableHeaderProps<T, K>
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    HeaderProps<T, K> {}

export const SortableTableHeader = <T extends unknown, K>({
  label,
  sorterKey,
  currentSorter,
  ascending,
  setSorter,
  setSortAscending,
  hoverTooltip,
  variant,
}: SortableTableHeaderProps<T, K>) => {
  const SortIcon = ascending ? BsCaretUpFill : BsCaretDownFill;
  const isSortable =
    sorterKey && currentSorter && setSortAscending && setSorter;

  const Comp = isSortable ? "button" : "div";
  return (
    <Comp
      className={cn(tableHeaderVariants({ variant }))}
      onClick={() => {
        if (!sorterKey || !currentSorter || !setSortAscending || !setSorter)
          return;

        if (currentSorter.key === sorterKey) {
          setSortAscending((a) => !a);
        } else {
          setSorter(sorterKey);
          setSortAscending(true);
        }
      }}
    >
      <WithIconAndTooltip
        className="items-top flex flex-row justify-end gap-0.5"
        side="top"
        tooltipContent={hoverTooltip}
      >
        <span className={cn(headerTextVariants({ variant }))}>{label}</span>
      </WithIconAndTooltip>

      {isSortable && currentSorter?.key === sorterKey && <SortIcon />}
    </Comp>
  );
};
