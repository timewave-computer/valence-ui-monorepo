import clsx from "clsx";
import { ReactNode } from "react";

export type ButtonProps = {
  /**
   * The callback for when the button is clicked.
   */
  onClick: () => void;
  /**
   * The content of the button.
   */
  children: ReactNode;
  /**
   * An optional class name for the button.
   */
  className?: string;
  /**
   * The style to apply to the button. Defaults to `primary`.
   */
  style?: "primary" | "secondary";
};

export const Button = ({
  onClick,
  children,
  className,
  style = "primary",
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "text-center py-1.5 px-2 transition",
        {
          "bg-valence-black text-valence-white border border-valence-black hover:bg-valence-white hover:text-valence-black hover:border-valence-black": style === "primary",
          "bg-valence-white text-valence-black border border-valence-black hover:bg-valence-black hover:text-valence-white":
            style === "secondary",
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
