"use client";
import { cn } from "@/utils";
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
  /**
   * To show loading state
   */
  isLoading?: boolean;
  /***
   * Disable the input
   */
  isDisabled?: boolean;
  /***
   * Option to limit what is shown
   */
  availableOptions?: DropdownOption<T>[];
};

export const Dropdown = <T extends string>({
  options,
  selected,
  onSelected,
  placeholder = "Select",
  containerClassName,
  isLoading,
  isDisabled,
  availableOptions,
  ...props
}: DropdownProps<T> & React.HTMLAttributes<HTMLDivElement>) => {
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

  const dropdownOptions = availableOptions ? availableOptions : options;

  return (
    <div className="relative" ref={containerRef} {...props}>
      {isLoading ? (
        <button
          disabled={true}
          className={cn(
            "flex h-full min-h-10 w-full min-w-[12rem] animate-pulse  flex-row items-center justify-between gap-6 border bg-valence-lightgray p-2 ",
            containerClassName,
          )}
        ></button>
      ) : (
        <button
          disabled={isLoading || isDisabled}
          className={cn(
            "flex h-full w-full min-w-[12rem] flex-row items-center justify-between gap-6 border border-valence-mediumgray bg-valence-white p-2 pl-3",
            isPlaceholder ? "text-valence-gray" : "text-valence-black",
            isDisabled &&
              "border-valence-gray bg-valence-lightgray text-valence-gray",
            containerClassName,
          )}
          onClick={() => setVisible(!visible)}
        >
          <span className="max-w-3/4 overflow-hidden">
            {selectedOption?.label ?? placeholder}
          </span>

          <BsChevronDown className="h-4 w-4 shrink-0" />
        </button>
      )}

      {visible && (
        <div className="absolute left-0 right-0 top-[calc(100%-1px)] z-10 flex flex-col border border-valence-mediumgray bg-gray-100">
          {dropdownOptions.map((option, index) => (
            <button
              key={option.value}
              className={cn(
                "hover flex flex-row items-center justify-between gap-6 p-2 pl-3",
                index < options.length - 1 &&
                  "border-b border-valence-mediumgray",
              )}
              onClick={() => {
                onSelected(option.value);
                setVisible(false);
              }}
            >
              {option.label}
              {selectedOption === option && (
                <BsCheck2 className="h-5 w-5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
