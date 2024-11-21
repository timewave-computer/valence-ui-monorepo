import { TooltipContent, WithIconAndTooltip } from ".";
import { cn } from "../utils";
import * as FormPrimitive from "@radix-ui/react-form";

interface FormInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tooltipContent?: string;
  suffix?: string;
  containerClassName?: string;
}

/***
 * NOTE: must be inside Form.Root
 */
export const FormRoot = FormPrimitive.Root;

export function FormInputField({
  label,
  tooltipContent,
  suffix,
  className,
  containerClassName,
  name,
  ...props
}: FormInputFieldProps) {
  return (
    <FormPrimitive.Field
      name={name ?? label}
      className={cn("flex flex-col gap-1 ", containerClassName)}
    >
      <div className="text-xs font-medium">
        <WithIconAndTooltip
          {...(tooltipContent && {
            tooltipContent: (
              <TooltipContent title={label} text={tooltipContent} />
            ),
          })}
        >
          <FormPrimitive.Label>{label}</FormPrimitive.Label>
        </WithIconAndTooltip>
      </div>

      <div className="relative flex  items-center border-[1.5px] border-valence-lightgray bg-valence-lightgray  focus-within:border-valence-blue ">
        <FormPrimitive.Control asChild>
          <input
            {...props}
            name={name}
            // @ts-ignore
            onWheel={(e) => e.target?.blur()} // prevent scroll
            className={cn(
              "h-full grow  bg-transparent p-2 font-mono focus:outline-none",
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
    </FormPrimitive.Field>
  );
}
