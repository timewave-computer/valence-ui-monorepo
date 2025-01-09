"use client";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import { useRef } from "react";

const inputContainerVariants = cva(
  "flex w-full cursor-text flex-row items-center gap-2 font-mono border border-valence-mediumgray transition-all px-2 overflow-clip focus-within:outline outline-offset-0 outline-[0.4px]",
  {
    variants: {
      variant: {
        primary: "outline-none",
        form: "bg-valence-lightgray outline-valence-blue focus-within:border-valence-blue ",
      },
      size: {
        sm: "px-2 py-1.5 text-xs",
        base: "px-3 py-2 text-sm",
      },
      isError: {
        true: "border-valence-red outline-valence-red focus-within:border-valence-red",
      },
      isDisabled: {
        true: "!bg-valence-gray !border-valence-gray cursor-not-allowed",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
    },
  },
);

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputContainerVariants> {
  suffix?: string;
}

export const TextInput = ({
  className,
  suffix,
  variant,
  size,
  isError,
  value,
  isDisabled,
  ...props
}: TextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        inputContainerVariants({
          variant,
          size,
          isError,
          className,
          isDisabled,
        }),
      )}
    >
      <input
        // @ts-ignore
        onWheel={(e) => e.target?.blur()} // prevents scroll from changing input value when element is focused
        ref={inputRef}
        {...(isDisabled && { disabled: true })}
        value={isDisabled ? "" : value}
        className={cn(
          "outline-none bg-transparent w-full",
          isDisabled && "cursor-not-allowed",
        )}
        {...props}
      />
      {suffix && <span className="pointer-events-none w-fit">{suffix}</span>}
    </div>
  );
};
