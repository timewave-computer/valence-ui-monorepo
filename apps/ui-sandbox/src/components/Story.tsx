import React from "react";
import { StoryLabel } from "./StoryLabel";
export const Story = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) => {
  return (
    <div className="flex flex-col gap-4">
      {label && <StoryLabel className="text-xs">{label}</StoryLabel>}
      {children}
    </div>
  );
};
