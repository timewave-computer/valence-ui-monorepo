import { cn } from "@/utils";
import { BsCheck2 } from "react-icons/bs";

export type CheckboxProps = {
  /**
   * Whether or not the input is checked.
   */
  checked: boolean;
  /**
   * The callback for when the input value changes.
   */
  onChange: (value: boolean) => void;
};

export const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  return (
    <button
      className={cn(
        "flex h-4 w-4 cursor-pointer flex-row items-center justify-center border border-valence-black bg-valence-white outline-none",
      )}
      onClick={() => onChange(!checked)}
    >
      <BsCheck2
        className={cn(
          "h-3 w-3 text-valence-black transition",
          checked ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
};
