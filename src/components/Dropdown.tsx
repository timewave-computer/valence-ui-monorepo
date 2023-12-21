import clsx from "clsx";
import { useState } from "react";
import { BsCheck2, BsChevronDown } from "react-icons/bs";

export type DropdownOption<T extends string> = {
  label: string;
  value: T;
};

export type DropdownProps<T extends string> = {
  /**
   * The dropdown options.
   */
  options: DropdownOption<T>[];
  /**
   * The selected option value.
   */
  selected: T | undefined;
  /**
   * The callback when an option is selected.
   */
  onSelected: (value: T) => void;
  /**
   * The placeholder text when no option is selected.
   */
  placeholder?: string;
};

export const Dropdown = <T extends string>({
  options,
  selected,
  onSelected,
  placeholder = "Select",
}: DropdownProps<T>) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = selected
    ? options.find((option) => option.value === selected)
    : undefined;
  const isPlaceholder = !selectedOption;

  return (
    <div className="relative">
      <button
        className={clsx(
          "w-full border border-slate-300 p-2 pl-3 flex flex-row gap-6 justify-between items-center min-w-[12rem] bg-white",
          isPlaceholder ? "text-gray-700" : "text-black"
        )}
        onClick={() => setVisible(!visible)}
      >
        {selectedOption?.label ?? placeholder}
        <BsChevronDown className="w-5 h-5 shrink-0" />
      </button>

      {visible && (
        <div className="absolute z-10 top-[calc(100%-1px)] left-0 right-0 border border-slate-300 bg-gray-100 flex flex-col">
          {options.map((option, index) => (
            <button
              key={option.value}
              className={clsx(
                "p-3 pl-4 flex flex-row gap-6 justify-between items-center hover",
                index < options.length - 1 && "border-b border-slate-300"
              )}
              onClick={() => {
                onSelected(option.value);
                setVisible(false);
              }}
            >
              {option.label}
              {selectedOption === option && <BsCheck2 className="w-6 h-6 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
