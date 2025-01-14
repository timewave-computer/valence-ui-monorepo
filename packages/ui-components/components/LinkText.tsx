import { cn } from "../utils";
import { cva, VariantProps } from "class-variance-authority";
import { ElementType } from "react";

const linkTextVariants = cva("text-valence-black hover:underline", {
  variants: {
    variant: {
      primary: "font-medium",
      secondary: "",
      highlighted: "text-valence-blue",
    },
  },
});

export interface LinkTextProps
  extends React.LinkHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkTextVariants> {
  blankTarget?: boolean;
  LinkComponent?: ElementType<any>;
  href: string; // make required
}

export const LinkText = ({
  href,
  blankTarget,
  children,
  LinkComponent,
  className,
  variant,
}: LinkTextProps) => {
  const Comp = LinkComponent ?? "a";
  return (
    <Comp
      target={blankTarget ? "_blank" : ""}
      rel={blankTarget ? "noreferrer" : undefined}
      href={href}
      className={cn(linkTextVariants({ className, variant }))}
    >
      {children}
    </Comp>
  );
};
