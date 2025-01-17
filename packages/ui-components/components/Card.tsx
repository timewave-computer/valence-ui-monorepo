import { cn } from "../utils";
import { ReactNode } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn("p-4 border border-valence-black", className)}
    >
      {children}
    </div>
  );
};
