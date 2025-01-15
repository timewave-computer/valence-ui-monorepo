"use client";
import React, { ReactNode } from "react";
import { Heading } from ".";
import { cn } from "../utils";

export const HoverContent: React.FC<{
  title?: string;
  text?: string;
  children?: ReactNode;
  className?: string;
}> = ({ title, text, children, className }) => {
  return (
    <div
      className={cn(
        "w-fit flex flex-col border-valence-black items-start justify-start gap-2 p-4 text-sm text-valence-black  bg-valence-white border drop-shadow-md",
        className,
      )}
    >
      {(text || title) && (
        <div className="flex flex-col items-start justify-start gap-2">
          {title && <Heading level="h6">{title}</Heading>}
          {text && (
            <p className="text-wrap  text-left text-sm font-normal">{text}</p>
          )}
        </div>
      )}
      {children && (
        <div className="text-left text-sm font-normal">{children}</div>
      )}
    </div>
  );
};
