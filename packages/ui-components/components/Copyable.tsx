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
      <HoverCardContent
        side="top"
        className="flex flex-col gap-1 p-2 items-center"
      >
        <div className="text-xs font-medium">Click to copy</div>
        <div className="text-xs font-mono"> {copyText}</div>
      </HoverCardContent>
    </HoverCardRoot>
  );
};
