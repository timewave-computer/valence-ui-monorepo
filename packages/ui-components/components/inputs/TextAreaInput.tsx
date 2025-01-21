"use client";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const inputContainerVariants = cva(
  "flex w-full cursor-text flex-row items-center gap-2 font-mono border border-valence-mediumgray transition-all px-2 overflow-clip focus-within:outline outline-offset-0 outline-[0.4px]",
  {
    variants: {
      variant: {
        primary: "outline-none",
        form: "bg-valence-lightgray outline-valence-blue focus-within:border-valence-blue ",
      },
      size: {
        sm: "px-2 py-1.5 text-xs font-light",
        base: "px-3 py-2 text-sm",
      },
      isError: {
        true: "border-valence-red outline-valence-red focus-within:border-valence-red",
      },
      isDisabled: {
        true: "!bg-valence-mediumgray !border-valence-gray cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
    },
  },
);

interface TextAreaInputProps
  extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof inputContainerVariants> {}

export const TextAreaInput = ({
  className,
  variant,
  size,
  isError,
  isDisabled,
  value,
  ...props
}: TextAreaInputProps) => {
  return (
    <textarea
      className={cn(
        inputContainerVariants({
          variant,
          size,
          isError,
          className,
          isDisabled,
        }),
      )}
      rows={5}
      value={isDisabled ? "" : value}
      {...(isDisabled && { disabled: true })}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === "Escape") {
          e.currentTarget.blur();
        }
      }}
      aria-invalid={!!isError}
      aria-disabled={!!isDisabled}
      {...props}
    />
  );
};
