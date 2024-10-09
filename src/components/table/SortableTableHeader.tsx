import { cn } from "@/utils";
import React, { Dispatch, SetStateAction } from "react";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { WithIconAndTooltip } from "@/components";

export type Sorter<T> = {
  key: string;
  sort: (a: T, b: T, ascending: boolean) => number;
};

export type SortableTableHeaderProps<T> = {
  /**
   * The label of the header.
   */
  label: string;
  /**
   * The sorter key.
   */
  sorterKey: string;
  /**
   * The currently selected sorter.
   */
  currentSorter: Sorter<T>;
  /**
   * Whether or not sorter is ascending.
   */
  ascending: boolean;
  /**
   * Set the current sorter.
   */
  setSorter: Dispatch<SetStateAction<string>>;
  /**
   * Set whether or not sorter is ascending.
   */
  setSortAscending: Dispatch<SetStateAction<boolean>>;
  /**
   * An optional class name for the button.
   */
  buttonClassName?: string;
  /**
   * An optional class name for the button.
   */
  textClassName?: string;
  /***
   * An optional hover tooltip.
   */
  hoverTooltip?: React.ReactNode;
};

export const SortableTableHeader = <T extends unknown>({
  label,
  sorterKey,
  currentSorter,
  ascending,
  setSorter,
  setSortAscending,
  buttonClassName,
  textClassName,
  hoverTooltip,
}: SortableTableHeaderProps<T>) => {
  const SortIcon = ascending ? BsCaretUpFill : BsCaretDownFill;

  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2 text-nowrap border-y border-valence-black p-4 outline-none",
        buttonClassName,
      )}
      onClick={() => {
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
        <button className={cn("text-nowrap text-sm font-bold", textClassName)}>
          {label}
        </button>
      </WithIconAndTooltip>
      {currentSorter.key === sorterKey && <SortIcon />}
    </div>
  );
};
