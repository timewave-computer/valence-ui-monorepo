import { cn } from "@valence-ui/ui-components";
import React from "react";
export const Section = ({
  children,
  label,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("p-2 flex flex-col gap-1 w-fit", className)}>
      <h1 className="pb-2 font-mono font-bold">{label}</h1>
      {children}
    </div>
  );
};
