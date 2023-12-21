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
};

export const Button = ({
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      className="bg-black text-white text-center py-2 px-3 transition hover:bg-gray-800"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
