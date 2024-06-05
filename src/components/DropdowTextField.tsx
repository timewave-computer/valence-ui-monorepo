import { cn } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { motion } from "framer-motion";

export type DropdownTextFieldOption = {
  label: string;
  value: string;
};
export type DropdownTextFieldProps = {
  /**
   * The dropdown options.
   */
  options: DropdownTextFieldOption[];
  /**
   * The selected option value.
   */
  value: string | undefined;
  /**
   * The callback when an option is selected.
   */
  onChange: (value: string) => void;
  /**
   * The placeholder text when no option is selected.
   */
  placeholder?: string;
};

export const DropdownTextField = ({
  options,
  value,
  onChange: handleChange,
  placeholder = "Select",
}: DropdownTextFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      event.target &&
      inputContainerRef.current &&
      !inputContainerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={inputContainerRef} className="relative">
      <div
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={cn(
          "flex flex-row gap-4",
          "flex h-full w-full min-w-[12rem] flex-row items-center justify-between gap-6 border border-valence-mediumgray bg-valence-white p-2 pl-3",
        )}
      >
        <input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="flex w-full grow basis-0 cursor-text flex-row items-center gap-2 bg-transparent font-mono text-valence-black outline-none"
          type="text"
        ></input>
        <BsChevronDown
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="h-4 w-4 shrink-0 text-valence-gray"
        />
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.05, ease: "easeInOut" }}
          className="absolute left-0 right-0 top-[calc(100%-1px)] z-10 flex flex-col border border-valence-mediumgray bg-gray-100 transition-all"
        >
          {options.map((option) => {
            return (
              <div
                onClick={() => {
                  handleChange(option.value);
                  setIsOpen(false);
                }}
                className=" flex flex-col gap-0.5  bg-valence-white px-3 py-3 font-mono hover:bg-valence-lightgray"
                key={`featured-account-${option.value}`}
              >
                <div className="flex flex-row justify-between gap-2 text-sm">
                  <span className="text-wrap">{option.label}</span>
                  <span className="h-fit bg-valence-mediumgray px-1.5 py-0.5 text-xs text-valence-black ">
                    Featured
                  </span>
                </div>
                <span className="overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-valence-gray">
                  {option.value}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
