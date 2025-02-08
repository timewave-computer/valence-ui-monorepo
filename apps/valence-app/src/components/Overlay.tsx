import { cn } from "@valence-ui/ui-components";
import { type HTMLMotionProps, motion } from "framer-motion";
import React from "react";

interface OverlayProps extends HTMLMotionProps<"div"> {
  position?: {
    top?: number;
    left?: number;
    height?: number;
  };
  className?: string;
}
export const Overlay = React.forwardRef<HTMLDivElement | null, OverlayProps>(
  (
    {
      position = {
        top: 0,
        left: 0,
        height: 0,
      },
      children,
      className,
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        transition={{ ease: "easeIn", duration: 0.12 }}
        animate={{ opacity: 1 }}
        style={{
          position: "absolute",
          ...position,
        }}
        className={cn(
          "z-20  flex w-screen flex-grow flex-col items-center justify-center bg-valence-gray/70",
          className,
        )}
      >
        {children}
      </motion.div>
    );
  },
);

Overlay.displayName = "Overlay";
