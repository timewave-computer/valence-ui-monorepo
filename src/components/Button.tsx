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
          "bg-black text-white hover:bg-gray-800": style === "primary",
          "bg-white text-black hover:bg-gray-200 border border-black":
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
