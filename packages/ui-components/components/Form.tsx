import { cn } from "../utils";
import * as FormPrimitive from "@radix-ui/react-form";
import { forwardRef } from "react";
import { IconTooltipContent, TextInput, WithIconAndTooltip } from ".";

export const FormRoot = FormPrimitive.Root;
export const FormField = FormPrimitive.Field;
export const FormControl = FormPrimitive.Control;

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
          <TextInput {...props} className={className} />
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

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: string; // text arg so it can be used for the tooltip too
  tooltipContent?: string;
  tooltipChildren?: React.ReactNode; // to give anything other than plaintext
}

export function FormInputLabel({
  label,
  tooltipContent,
  tooltipChildren,
}: InputLabelProps) {
  return (
    <div className="text-xs font-medium text-nowrap">
      <WithIconAndTooltip
        {...(tooltipContent && {
          tooltipContent: (
            <IconTooltipContent title={label} text={tooltipContent}>
              {tooltipChildren}
            </IconTooltipContent>
          ),
        })}
      >
        {label}
      </WithIconAndTooltip>
    </div>
  );
}
