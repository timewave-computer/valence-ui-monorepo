import { cn } from "@valence-ui/ui-components";
import React from "react";

export const Section = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section id={id} className={cn("p-2 flex flex-col gap-2", className)}>
      {children}
    </section>
  );
};
