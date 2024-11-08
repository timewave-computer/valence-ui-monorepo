"use client";
import { cn } from "~/utils";
import { useRef } from "react";

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
  /***
   * An optional id to attach to the input
   */
  id?: string;
};

export const TextInput = ({
  input,
  onChange,
  placeholder,
  textClassName,
  containerClassName,
  style,
  label,
  id,
}: TextInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "relative flex w-[12rem] cursor-text flex-row items-center gap-4",
        style !== "ghost" && "border border-valence-mediumgray px-3 py-2",
        containerClassName,
      )}
      onClick={() => ref.current?.focus()}
    >
      {!!label && (
        <div className="-my-2 flex grow basis-0 flex-row items-center border-r border-valence-mediumgray py-2 pr-2">
          <p>{label}</p>
        </div>
      )}

      <input
        id={id}
        ref={ref}
        type="text"
        className={cn(
          "z-[1] flex w-full min-w-0 grow basis-0 flex-row items-center gap-2 bg-transparent text-valence-black outline-none",
          textClassName,
        )}
        value={input}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Placeholder when input is empty */}
      {!input && !!placeholder && (
        <div
          className={cn(
            "absolute bottom-0 left-0 top-0 z-0",
            style !== "ghost" && "p-2 pl-3",
          )}
        >
          <p className={cn("text-valence-gray", textClassName)}>
            {placeholder}
          </p>
        </div>
      )}
    </div>
  );
};
