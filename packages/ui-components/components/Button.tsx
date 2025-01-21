import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import React, { ElementType } from "react";
import { LoadingIndicator } from "./LoadingIndicator";

const buttonVariants = cva(
  "text-center  rounded-sm  w-fit  transition-all text-nowrap flex flex-row items-center justify-center border-valence-black border",
  {
    variants: {
      variant: {
        primary:
          "bg-valence-black text-valence-white  border-valence-black hover:bg-valence-white hover:text-valence-black focus:bg-valence-white focus:text-valence-black focus:border-valence-black",
        secondary:
          "bg-valence-white text-valence-black  hover:bg-valence-black transition-all hover:text-valence-white  ",
        loading: "bg-valence-mediumgray ",
      },
      disabled: {
        true: "!bg-valence-gray hover:!bg-valence-gray focus:!bg-valence-gray cursor-not-allowed  !border-valence-gray !text-valence-black",
      },
      size: {
        sm: "py-0.5 px-1.5 text-sm min-w-12 min-h-7",
        base: " min-h-9 min-w-20  py-1.5 px-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "base",
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
  link?: {
    href: string;
    blankTarget?: boolean;
    LinkComponent?: ElementType<any>;
  };
  PrefixIcon?: React.ElementType;
  SuffixIcon?: React.ElementType;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      disabled = false,
      variant,
      isLoading,
      children,
      PrefixIcon,
      SuffixIcon,
      link,
      size,
      ...props
    },
    ref,
  ) => {
    const { href, LinkComponent = "a", blankTarget = true } = link || {};

    let Comp: React.ElementType = href ? LinkComponent : "button";

    const _disabled = isLoading || disabled;
    let _variant = !!isLoading ? "loading" : variant;

    return (
      <Comp
        {...(href
          ? {
              href,
              target: blankTarget ? "_blank" : "",
              rel: "noopener noreferrer",
            }
          : {})}
        // commented out for now to render disabled tooltip
        // disabled={disabled} // keep it here for accessibilty but style is handled in CVA
        className={cn(
          buttonVariants({
            disabled: _disabled,
            variant: _variant,
            size,
            className,
          }),
        )}
        // @ts-ignore because we sometimes use a button to render <a> tag, but dont accept rest of <a> tag args bedies href
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <LoadingIndicator variant="sm" />
        ) : (
          <div className="flex flex-row gap-2 items-center">
            {PrefixIcon && <PrefixIcon className="h-4 w-4" />}
            {children}
            {SuffixIcon && <SuffixIcon className="h-4 w-4" />}
          </div>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
