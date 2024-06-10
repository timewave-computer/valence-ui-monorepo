"use client";
import { cn } from "@/utils";
import { useRef } from "react";
import { BsDash, BsPlus } from "react-icons/bs";

export type NumberInputProps = {
  /**
   * The input value.
   */
  input: string | undefined;
  /**
   * The callback for when the input value changes.
   */
  onChange: (value: string) => void;
  /**
   * An optional class name applied to the input and placeholder.
   */
  textClassName?: string;
  /**
   * An optional class name applied to the container.
   */
  containerClassName?: string;
  /**
   * An optional minimum value.
   */
  min?: number;
  /**
   * An optional maximum value.
   */
  max?: number;
  /**
   * An optional unit to append to the input.
   */
  unit?: string;
  /**
   * Hide the plus/minus buttons.
   */
  hidePlusMinus?: boolean;
  /***
   * Disable the input
   */
  isDisabled?: boolean;
};

export const NumberInput = ({
  input,
  onChange,
  textClassName,
  containerClassName,
  min = -Infinity,
  max = Infinity,
  unit,
  hidePlusMinus,
  isDisabled,
}: NumberInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "relative flex cursor-text flex-row items-center gap-2 border border-valence-mediumgray px-2 py-3",
        containerClassName,
        isDisabled && "border-valence-gray bg-valence-lightgray",
      )}
      onClick={() => ref.current?.focus()}
    >
      {!hidePlusMinus && (
        <button
          className="flex flex-row items-center justify-center"
          onClick={() =>
            onChange(
              Math.round(
                Math.max(min, Math.min((Number(input) || 0) - 1, max)),
              ).toString(),
            )
          }
        >
          <BsDash className="h-6 w-6 opacity-50" />
        </button>
      )}

      <div
        className="relative flex min-w-0 grow flex-row items-center justify-center gap-0.5 self-stretch"
        onClick={() => ref.current?.focus()}
      >
        <input
          disabled={isDisabled}
          ref={ref}
          type="number"
          className={cn(
            "z-10 flex w-[50%] flex-row items-center gap-2 bg-transparent text-center text-valence-black outline-none",
            textClassName,
          )}
          value={input}
          onChange={(e) => onChange(e.target.value)}
        />

        {!!unit && (
          <p
            className={cn(
              "pointer-events-none absolute right-2 select-none text-valence-black",
              textClassName,
            )}
          >
            {unit}
          </p>
        )}
      </div>

      {!hidePlusMinus && (
        <button
          className="flex flex-row items-center justify-center"
          onClick={() =>
            onChange(
              Math.round(
                Math.max(min, Math.min((Number(input) || 0) + 1, max)),
              ).toString(),
            )
          }
        >
          <BsPlus className="h-6 w-6 opacity-50" />
        </button>
      )}
    </div>
  );
};
