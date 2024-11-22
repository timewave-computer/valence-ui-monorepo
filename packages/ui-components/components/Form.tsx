import { cn } from "../utils";
import * as FormPrimitive from "@radix-ui/react-form";
import { forwardRef } from "react";

export const FormRoot = FormPrimitive.Root;
export const FormField = FormPrimitive.Field;

interface FormTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
  containerClassName?: string;
  isError?: boolean;
}

export const FormTextInput = forwardRef<HTMLInputElement, FormTextInputProps>(
  (
    { suffix, className, containerClassName, disabled, isError, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "relative flex  items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue",
          isError && "border-valence-red focus-within:border-valence-red",
          disabled && "bg-valence-gray cursor-not-allowed",
          containerClassName,
        )}
      >
        <FormPrimitive.Control asChild>
          <input
            {...props}
            ref={ref}
            // @ts-ignore
            onWheel={(e) => e.target?.blur()} // prevents scroll from changing input value when element is focused
            className={cn(
              " h-full grow  bg-transparent p-2 font-mono focus:outline-none",
              className,
            )}
          />
        </FormPrimitive.Control>

        {suffix && (
          <span className="pointer-events-none w-fit  font-mono px-2 pl-1">
            {suffix}
          </span>
        )}
      </div>
    );
  },
);
