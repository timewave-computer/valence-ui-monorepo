import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

const iconButtonVariants = cva("", {
  variants: {
    variant: {
      sm: "h-4 w-4",
      base: "h-6 w-6",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});

const defaultButtonClassName = "transition-all hover:scale-105 ";

export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  onClick?: () => void;
  disabled?: boolean;
  Icon: React.ElementType;
  disabledTooltip?: React.ReactNode;
  isServer?: boolean;
  iconClassName?: string;
}
export const IconButton: React.FC<IconButtonProps> = ({
  Icon,
  disabled,
  onClick,
  disabledTooltip,
  className,
  isServer,
  iconClassName,
  variant,
}) => {
  if (isServer) {
    return (
      <button className={cn(defaultButtonClassName, className)}>
        <Icon
          onClick={() => {
            return;
          }}
          className={iconButtonVariants({
            variant,
            className: cn(disabled && "text-valence-gray", iconClassName),
          })}
        />
      </button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button className={cn(defaultButtonClassName, className)}>
            <Icon
              onClick={() => {
                if (disabled) return;
                if (onClick) onClick();
              }}
              className={iconButtonVariants({
                variant,
                className: cn(disabled && "text-valence-gray", iconClassName),
              })}
            />
          </button>
        </TooltipTrigger>
        {disabled && disabledTooltip && (
          <TooltipContent>{disabledTooltip}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
