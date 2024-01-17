import clsx from "clsx";
import { useRef } from "react";
import { BsPencilSquare } from "react-icons/bs";

export type TextInputProps = {
  /**
   * The input text.
   */
  input: string | undefined;
  /**
   * The callback for when the input value changes.
   */
  onChange: (value: string) => void;
  /**
   * The placeholder text when the input is empty.
   */
  placeholder?: string;
  /**
   * An optional class name applied to the input and placeholder.
   */
  textClassName?: string;
  /**
   * An optional class name applied to the container.
   */
  containerClassName?: string;
  /**
   * An optional style to apply.
   *
   * `ghost` will remove the border, padding, and icon.
   */
  style?: "ghost";
  /**
   * Hide the icon.
   */
  noIcon?: boolean;
};

export const TextInput = ({
  input,
  onChange,
  placeholder,
  textClassName,
  containerClassName,
  style,
  noIcon,
}: TextInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className={clsx(
        "relative flex flex-row items-center gap-4 w-[12rem] cursor-text",
        style !== "ghost" && "py-2 px-3 border border-slate-300",
        containerClassName
      )}
      onClick={() => ref.current?.focus()}
    >
      <input
        ref={ref}
        type="text"
        className={clsx(
          "flex flex-row gap-2 items-center text-black outline-none z-10 bg-transparent min-w-0 w-full",
          textClassName
        )}
        value={input}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Placeholder when input is empty */}
      {!input && !!placeholder && (
        <div
          className={clsx(
            "absolute left-0 top-0 bottom-0 z-0",
            style !== "ghost" && "p-2 pl-3"
          )}
        >
          <p className={clsx("text-gray-500", textClassName)}>{placeholder}</p>
        </div>
      )}

      {style !== "ghost" && !noIcon && (
        <BsPencilSquare className="shrink-0 w-4 h-4 text-gray-600" />
      )}
    </div>
  );
};
