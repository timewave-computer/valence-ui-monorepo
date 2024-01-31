import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
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
  /**
   * An optional class name to apply to the container.
   */
  containerClassName?: string;
};

export const Dropdown = <T extends string>({
  options,
  selected,
  onSelected,
  placeholder = "Select",
  containerClassName,
}: DropdownProps<T>) => {
  const [visible, setVisible] = useState(false);

  const selectedOption = selected
    ? options.find((option) => option.value === selected)
    : undefined;
  const isPlaceholder = !selectedOption;

  // Close when click anywhere else.
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onClick = (event: MouseEvent) => {
      if (
        event.target &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };

    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className={clsx(
          "w-full h-full border border-valence-mediumgray p-2 pl-3 flex flex-row gap-6 justify-between items-center min-w-[12rem] bg-valence-white",
          isPlaceholder ? "text-valence-gray" : "text-valence-black",
          containerClassName
        )}
        onClick={() => setVisible(!visible)}
      >
        {selectedOption?.label ?? placeholder}
        <BsChevronDown className="w-4 h-4 shrink-0" />
      </button>

      {visible && (
        <div className="absolute z-10 top-[calc(100%-1px)] left-0 right-0 border border-valence-mediumgray bg-gray-100 flex flex-col">
          {options.map((option, index) => (
            <button
              key={option.value}
              className={clsx(
                "p-2 pl-3 flex flex-row gap-6 justify-between items-center hover",
                index < options.length - 1 && "border-b border-valence-mediumgray"
              )}
              onClick={() => {
                onSelected(option.value);
                setVisible(false);
              }}
            >
              {option.label}
              {selectedOption === option && (
                <BsCheck2 className="w-5 h-5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
