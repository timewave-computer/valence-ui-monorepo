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
        "flex flex-row justify-center items-center border border-valence-mediumgray w-7 h-7 cursor-pointer outline-none transition",
        checked ? "bg-valence-black" : "bg-valence-white",
      )}
      onClick={() => onChange(!checked)}
    >
      <BsCheck2
        className={cn(
          "w-5 h-5 text-valence-white transition",
          checked ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
};
