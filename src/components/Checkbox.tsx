import clsx from "clsx";
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
      className={clsx(
        "flex flex-row justify-center items-center border border-slate-300 w-10 h-10 cursor-pointer outline-none transition",
        checked ? "bg-black" : "bg-white"
      )}
      onClick={() => onChange(!checked)}
    >
      <BsCheck2
        className={clsx(
          "w-6 h-6 text-white transition",
          checked ? "opacity-100" : "opacity-0"
        )}
      />
    </button>
  );
};
