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
        "bg-valence-lightgray text-sm font-mono font-bold w-fit px-4 py-1  rounded-md  shadow-sm   shadow-valence-gray",
        className
      )}
    >
      {children}
    </h2>
  );
};
