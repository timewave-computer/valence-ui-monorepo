"use client";
import { TooltipContent, TooltipTrigger } from "@/components";
import { cn } from "@/utils";
import { Tooltip } from "@/components";
import { TooltipProvider } from "@radix-ui/react-tooltip";

type IconButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  onClick: () => void;
  disabled?: boolean;
  Icon: React.ElementType;
  disabledTooltip?: React.ReactNode;
};
export const IconButton: React.FC<IconButtonProps> = ({
  Icon,
  disabled,
  onClick,
  disabledTooltip,
  className,
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button>
            <Icon
              onClick={() => {
                if (disabled) return;
                onClick();
              }}
              className={cn(
                "h-6 w-6",
                disabled && "text-valence-gray",
                className,
              )}
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
