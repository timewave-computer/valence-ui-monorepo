import { cn } from "@valence-ui/ui-components";
import { ReactNode } from "react";

export const StoryLabel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "bg-valence-lightgray text-sm font-mono font-bold w-fit px-2 py-1",
        className
      )}
    >
      {children}
    </h2>
  );
};
