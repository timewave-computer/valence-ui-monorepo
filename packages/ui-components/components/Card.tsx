import { cn } from "../utils";
import { LoadingSkeleton } from "./LoadingSkeleton";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  isLoading,
  ...props
}) => {
  if (isLoading) return <LoadingSkeleton className=" w-full grow h-72" />;
  else
    return (
      <div
        {...props}
        className={cn("p-4 border border-valence-black", className)}
      >
        {children}
      </div>
    );
};
