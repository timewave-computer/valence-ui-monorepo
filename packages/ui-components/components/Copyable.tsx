"use client";

import { ReactNode, useEffect, useState } from "react";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "./Popover";

export const Copyable = ({
  children,
  copyText,
}: {
  children: ReactNode;
  copyText: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(copyText).then(() => {});
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1600);

      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <PopoverRoot
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
      }}
    >
      <PopoverTrigger
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        onMouseLeave={handleMouseLeave}
        onClick={handleCopy}
        side="top"
        className="flex flex-col gap-1 p-2 items-center"
      >
        <div className="text-xs font-medium">
          {isCopied ? "Copied" : "Click to copy"}
        </div>
        <div className="text-xs font-mono"> {copyText}</div>
      </PopoverContent>
    </PopoverRoot>
  );
};
