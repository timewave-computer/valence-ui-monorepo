import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";
import React from "react";

const buttonVariants = cva("text-center py-1.5 px-2  transition-colors", {
  variants: {
    variant: {
      primary:
        "bg-valence-black text-valence-white border border-valence-black focus:bg-valence-white focus:text-valence-black focus:border-valence-black",
      secondary:
        "bg-valence-white text-valence-black border border-valence-black  ",
    },
    disabled: {
      true: "!bg-valence-gray  !border-valence-gray !text-valence-white !opacity-50",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, disabled = false, variant, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        disabled={disabled} // keep it here for accessibilty but style is handled in CVA
        className={cn(buttonVariants({ disabled, variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
