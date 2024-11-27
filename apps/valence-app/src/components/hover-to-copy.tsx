"use client";
import { Label, cn } from "@valence-ui/ui-components";
import * as HoverCard from "@radix-ui/react-hover-card";
import { ReactNode, useState } from "react";
export const HoverToCopy: React.FC<{
  textToCopy: string;
  children: ReactNode;
  hoverContent: ReactNode;
}> = ({ children, textToCopy, hoverContent }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = (account: string) => {
    setIsCopying(true);
    setIsCopied(true);
    navigator.clipboard.writeText(account);
    setTimeout(() => {
      setIsCopied(false);
      setIsCopying(false);
    }, 1000);
  };

  return (
    <HoverCard.Root openDelay={0}>
      <HoverCard.Trigger
        onTouchMove={() => setIsCopying(false)}
        onClick={() => handleCopy(textToCopy)}
        asChild
      >
        {children}
      </HoverCard.Trigger>
      <HoverCard.Content
        side="top"
        {...(isCopying && { forceMount: true })}
        onClick={() => handleCopy(textToCopy)}
        className={cn(
          "z-50 flex flex-col items-center justify-center gap-2 border-[1px] border-valence-black bg-valence-white p-4 shadow-md",
        )}
      >
        {hoverContent}
        {isCopied ? <Label text="Copied" /> : <Label text="Click to copy" />}

        <HoverCard.Arrow />
      </HoverCard.Content>
    </HoverCard.Root>
  );
};
