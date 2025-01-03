import { cn } from "@valence-ui/ui-components";
import React from "react";

export const Section = ({
  children,

  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("p-2 flex flex-col gap-2", className)}>{children}</div>
  );
};
