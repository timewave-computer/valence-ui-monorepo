import { type VariantProps } from "class-variance-authority";
import React from "react";
declare const buttonVariants: (
  props?:
    | ({
        variant?: "primary" | "secondary" | "loading" | null | undefined;
        disabled?: boolean | null | undefined;
      } & import("class-variance-authority/dist/types").ClassProp)
    | undefined,
) => string;
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}
export declare const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;
export {};
//# sourceMappingURL=Button.d.ts.map
