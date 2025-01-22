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
          } else if (e.key === "Tab") {
            e.preventDefault();
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            if (e.shiftKey) {
              // Handle Shift+Tab: remove spaces before the caret
              const beforeCaret = textarea.value.substring(0, start);
              const afterCaret = textarea.value.substring(end);
              const match = beforeCaret.match(/(\s{1,2})$/);
              if (match) {
                const spacesToRemove = match[0].length;
                textarea.value =
                  beforeCaret.slice(0, -spacesToRemove) + afterCaret;
                textarea.selectionStart = textarea.selectionEnd =
                  start - spacesToRemove;
              }
            } else {
              // Set textarea value to: text before caret + tab + text after caret
              textarea.value =
                textarea.value.substring(0, start) +
                "  " +
                textarea.value.substring(end);

              // Put caret at right position again
              textarea.selectionStart = textarea.selectionEnd = start + 2;
            }
          }
        }}
        aria-invalid={!!isError}
        aria-disabled={!!isDisabled}
      />
    );
  },
);
