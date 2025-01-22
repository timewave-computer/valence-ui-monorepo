"use client";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import { forwardRef } from "react";

const textareaVariants = cva(
  "flex w-full cursor-text flex-row items-center gap-2 font-mono border border-valence-mediumgray transition-all px-2 overflow-y-scroll outline-none",
  {
    variants: {
      size: {
        sm: "px-2 py-1.5 text-xs",
        base: "px-3 py-2 text-sm",
      },
      isError: {
        true: "border-valence-red  focus-within:border-valence-red",
      },
      isDisabled: {
        true: "!bg-valence-mediumgray !border-valence-gray cursor-not-allowed",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
);

interface TextAreaInputProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {}

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextAreaInputProps
>(
  (
    { className, size, isError, isDisabled, value, rows = 5, ...props },
    ref,
  ) => {
    return (
      <textarea
        ref={ref}
        {...props}
        className={cn(
          textareaVariants({
            size,
            isError,
            className,
            isDisabled,
          }),
        )}
        rows={rows}
        value={isDisabled ? "" : value}
        {...(isDisabled && { disabled: true })}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.currentTarget.blur();
          }
        }}
        aria-invalid={!!isError}
        aria-disabled={!!isDisabled}
      />
    );
  },
);
