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
   * A label to attach to the left side of the input.
   */
  label?: string;
};

export const TextInput = ({
  input,
  onChange,
  placeholder,
  textClassName,
  containerClassName,
  style,
  label,
}: TextInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className={clsx(
        "relative flex flex-row items-center gap-4 w-[12rem] cursor-text",
        style !== "ghost" && "py-2 px-3 border border-valence-mediumgray",
        containerClassName
      )}
      onClick={() => ref.current?.focus()}
    >
      {!!label && (
        <div className="flex flex-row items-center border-r border-valence-mediumgray -my-2 py-2 pr-2 basis-0 grow">
          <p>{label}</p>
        </div>
      )}

      <input
        ref={ref}
        type="text"
        className={clsx(
          "flex flex-row gap-2 items-center text-valence-black outline-none z-[1] bg-transparent min-w-0 w-full basis-0 grow",
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
          <p className={clsx("text-valence-gray", textClassName)}>{placeholder}</p>
        </div>
      )}
    </div>
  );
};
