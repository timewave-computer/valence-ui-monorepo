import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { LoadingIndicator } from "@/components";

const buttonVariants = cva(
  "text-center py-1.5 px-2 min-h-8 min-w-16  transition-colors flex flex-row items-center justify-center",
  {
    variants: {
      variant: {
        primary:
          "bg-valence-black text-valence-white border border-valence-black focus:bg-valence-white focus:text-valence-black hover:bg-valence-white  hover:text-valence-black  ",
        secondary:
          "bg-valence-white text-valence-black border border-valence-black hover:bg-valence-black transition-all hover:text-valence-white  ",
      },
      disabled: {
        true: "!bg-valence-gray hover:!bg-valence-gray focus:!bg-valence-gray cursor-not-allowed  !border-valence-gray !text-valence-black",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      disabled = false,
      variant,
      asChild = false,
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const _disabled = isLoading || disabled;

    return (
      <Comp
        // commented out for now to render disabled tooltip
        // disabled={disabled} // keep it here for accessibilty but style is handled in CVA
        className={cn(
          buttonVariants({ disabled: _disabled, variant, className }),
        )}
        ref={ref}
        {...props}
      >
        {isLoading ? <LoadingIndicator variant="s" /> : <>{children}</>}
      </Comp>
    );
  },
);
Button.displayName = "Button";
