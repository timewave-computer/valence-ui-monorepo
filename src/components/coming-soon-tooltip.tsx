/***
 * Util class to display coming soon. Lots of redudant code, so this should make things easier to read
 */
"use client";
import {
  LinkText,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
import { X_HANDLE, X_URL } from "@/const/socials";
import { useEffect, useState } from "react";

export const TooltipWrapper: React.FC<{
  content: React.ReactNode;
  children: React.ReactNode;
  asChild?: boolean;
  sideOffset?: number;
}> = ({ content, asChild, children, sideOffset }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // pacify server side hydration errors
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger onClick={(e) => e.preventDefault()} asChild={asChild}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          align="start"
          onPointerDownOutside={(e) => e.preventDefault()}
          sideOffset={sideOffset}
          side="right"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ComingSoonTooltipContent = () => (
  <div className=" max-w-56">
    <p className="text-lg font-bold">Coming soon.</p>
    <p className="text-balance">
      Contact <LinkText href={X_URL}>{X_HANDLE}</LinkText> to access this
      feature.
    </p>
  </div>
);
