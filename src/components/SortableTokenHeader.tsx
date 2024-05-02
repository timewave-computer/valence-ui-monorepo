import { cn } from "@/utils";
import { Dispatch, SetStateAction } from "react";
import { BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";

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
};

export const SortableTableHeader = <T extends unknown>({
  label,
  sorterKey,
  currentSorter,
  ascending,
  setSorter,
  setSortAscending,
  buttonClassName,
}: SortableTableHeaderProps<T>) => {
  const SortIcon = ascending ? BsCaretUpFill : BsCaretDownFill;

  return (
    <button
      className={cn(
        "p-4 border-y border-valence-black flex flex-row items-center gap-2 outline-none",
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
      <p className="font-bold text-sm">{label}</p>
      {currentSorter.key === sorterKey && <SortIcon />}
    </button>
  );
};
