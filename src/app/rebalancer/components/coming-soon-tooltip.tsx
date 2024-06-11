/***
 * Util class to display coming soon. Lots of redudant code, so this should make things easier to read
 */

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
  trigger: React.ReactNode;
  asChild?: boolean;
}> = ({ content, trigger, asChild }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // pacify server side hydration errors
  if (!isClient) {
    return <>{trigger}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild={asChild}>{trigger}</TooltipTrigger>
        <TooltipContent side="right">{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ComingSoonTooltipContent = () => (
  <div className=" max-w-56">
    <p className="text-lg font-bold">Coming soon.</p>
    <p className="text-balance">
      Contact <LinkText href={X_URL}>{X_HANDLE}</LinkText> to access these
      features.
    </p>
  </div>
);
