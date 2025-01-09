import React from "react";
import { StoryLabel } from "./StoryLabel";
import { cn } from "@valence-ui/ui-components";

interface StoryProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}
export const Story = ({ children, label, className }: StoryProps) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {label && <StoryLabel className="text-xs">{label}</StoryLabel>}
      {children}
    </div>
  );
};
