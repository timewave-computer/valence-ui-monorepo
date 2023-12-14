import clsx from "clsx";
import { useState } from "react";
import { BsCheck2, BsChevronDown } from "react-icons/bs";

export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownProps = {
  /**
   * The dropdown options.
   */
  options: DropdownOption[];
  /**
   * The selected option value.
   */
  selected: string | undefined;
  /**
   * The callback when an option is selected.
   */
  onSelected: (value: string) => void;
  /**
   * The placeholder text when no option is selected.
   */
  placeholder?: string;
};

export const Dropdown = ({
  options,
  selected,
  onSelected,
  placeholder = "Select",
}: DropdownProps) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = selected
    ? options.find((option) => option.value === selected)
    : undefined;
  const isPlaceholder = !selectedOption;

  return (
    <div className="relative">
      <button
        className={clsx(
          "border border-slate-700 p-3 pl-4 flex flex-row gap-6 justify-between items-center bg-gray-950 min-w-[12rem]",
          isPlaceholder ? "text-gray-400" : "text-white"
        )}
        onClick={() => setVisible(!visible)}
      >
        {selectedOption?.label ?? placeholder}
        <BsChevronDown className="w-5 h-5 shrink-0" />
      </button>

      {visible && (
        <div className="absolute z-10 top-[calc(100%-1px)] left-0 right-0 border border-slate-700 bg-gray-950 flex flex-col">
          {options.map((option, index) => (
            <button
              key={option.value}
              className={clsx(
                "p-3 pl-4 flex flex-row gap-6 justify-between items-center hover hover:",
                index < options.length - 1 && "border-b border-slate-700"
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
