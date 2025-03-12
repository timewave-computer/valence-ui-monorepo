"use client";

import { ReactNode } from "react";
import { HoverCardRoot, HoverCardTrigger, HoverCardContent } from "./HoverCard";

export const Copyable = ({
  children,
  copyText,
  className,
}: {
  children: ReactNode;
  copyText: string;
  className?: string;
}) => {
  const handleCopy = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(copyText).then(() => {});
  };

  return (
    <HoverCardRoot>
      <HoverCardTrigger onClick={handleCopy}>
        <>{children}</>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="p-2">
        <div className="text-xs">Click to copy</div>
      </HoverCardContent>
    </HoverCardRoot>
  );
};
