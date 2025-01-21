import { cn } from "../";
import { BsCheck2 } from "react-icons/bs";

export type CheckboxProps = {
  disabled?: boolean;
  /**
   * Whether or not the input is checked.
   */
  checked: boolean;
  /**
   * The callback for when the input value changes.
   */
  onChange: (value: boolean) => void;
};

export const Checkbox = ({ checked, onChange, disabled }: CheckboxProps) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        "flex h-4 w-4 cursor-pointer flex-row items-center justify-center border border-valence-black bg-valence-white outline-none",
        disabled && "cursor-not-allowed",
      )}
      onClick={() => !disabled && onChange(!checked)}
    >
      <BsCheck2
        className={cn(
          disabled && "cursor-not-allowed",

          "h-3 w-3 text-valence-black transition",
          checked ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
};
