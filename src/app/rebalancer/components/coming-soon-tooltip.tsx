/***
 * Util class to display coming soon. Lots of redudant code, so this should make things easier to read
 */

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components";
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
      <Tooltip>
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
      Contact{" "}
      <a
        href="https://x.com/TimewaveLabs"
        target="_blank"
        className="text-valence-blue transition-all hover:underline"
      >
        @Timewavelabs
      </a>{" "}
      if you or your DAO want early access to the Rebalancer.
    </p>
  </div>
);
