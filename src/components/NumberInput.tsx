import clsx from "clsx";
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
}: NumberInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className={clsx(
        "relative flex flex-row items-center gap-2 cursor-text py-3 px-2 border border-valence-mediumgray",
        containerClassName
      )}
      onClick={() => ref.current?.focus()}
    >
      {!hidePlusMinus && (
        <button
          className="flex flex-row justify-center items-center"
          onClick={() =>
            onChange(
              Math.round(
                Math.max(min, Math.min((Number(input) || 0) - 1, max))
              ).toString()
            )
          }
        >
          <BsDash className="w-6 h-6 opacity-50" />
        </button>
      )}

      <div
        className="flex flex-row self-stretch justify-center items-center gap-0.5 min-w-0 grow relative"
        onClick={() => ref.current?.focus()}
      >
        <input
          ref={ref}
          type="number"
          className={clsx(
            "flex flex-row gap-2 items-center text-valence-black outline-none z-10 bg-transparent text-center w-[50%]",
            textClassName
          )}
          value={input}
          onChange={(e) => onChange(e.target.value)}
        />

        {!!unit && (
          <p
            className={clsx(
              "text-valence-black pointer-events-none select-none absolute right-2",
              textClassName
            )}
          >
            {unit}
          </p>
        )}
      </div>

      {!hidePlusMinus && (
        <button
          className="flex flex-row justify-center items-center"
          onClick={() =>
            onChange(
              Math.round(
                Math.max(min, Math.min((Number(input) || 0) + 1, max))
              ).toString()
            )
          }
        >
          <BsPlus className="w-6 h-6 opacity-50" />
        </button>
      )}
    </div>
  );
};
