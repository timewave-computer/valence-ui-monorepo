import clsx from "clsx";
import { useRef, useState } from "react";
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
};

export const TextInput = ({
  input,
  onChange,
  placeholder,
}: TextInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className="relative flex flex-row items-center gap-4 border border-slate-700 py-3 px-4 w-[12rem] cursor-text"
      onClick={() => ref.current?.focus()}
    >
      <input
        ref={ref}
        type="text"
        className="flex flex-row gap-2 items-center text-white outline-none z-10 bg-transparent min-w-0"
        value={input}
        onChange={(e) => onChange(e.target.value)}
      />

      {/* Placeholder when input is empty */}
      {!input && !!placeholder && (
        <div className="absolute left-0 top-0 bottom-0 p-3 pl-4 py-3 z-0">
          <p className="text-gray-400">{placeholder}</p>
        </div>
      )}

      <BsPencilSquare className="shrink-0 w-4 h-4 text-gray-200" />
    </div>
  );
};
