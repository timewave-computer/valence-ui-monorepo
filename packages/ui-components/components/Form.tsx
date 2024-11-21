import { IconTooltipContent, WithIconAndTooltip } from ".";
import { cn } from "../utils";
import * as FormPrimitive from "@radix-ui/react-form";
import { forwardRef } from "react";

export const FormRoot = FormPrimitive.Root;
export const FormField = FormPrimitive.Field;

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
  tooltipContent?: string;
}

export function FormLabel({ label, tooltipContent }: FormLabelProps) {
  return (
    <div className="text-xs font-medium">
      <WithIconAndTooltip
        {...(tooltipContent && {
          tooltipContent: (
            <IconTooltipContent title={label} text={tooltipContent} />
          ),
        })}
      >
        <FormPrimitive.Label>{label}</FormPrimitive.Label>
      </WithIconAndTooltip>
    </div>
  );
}

interface FormInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string;
  containerClassName?: string;
}

export const FormControl = forwardRef<HTMLInputElement, FormInputFieldProps>(
  ({ suffix, className, containerClassName, ...props }, ref) => {
    return (
      <FormPrimitive.Control asChild>
        <div
          className={cn(
            "text-xs relative flex  items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue",
            containerClassName,
          )}
        >
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

          {suffix && (
            <span className="pointer-events-none w-fit  font-mono px-2 pl-1">
              {suffix}
            </span>
          )}
        </div>
      </FormPrimitive.Control>
    );
  },
);
