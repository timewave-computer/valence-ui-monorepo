import { motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";

type OverlayProps = {
  position?: {
    top?: number;
    left?: number;
    height?: number;
  };
  children?: ReactNode;
};
export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  (
    {
      position = {
        top: 0,
        left: 0,
        height: 0,
      },
      children,
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
        className="z-20  flex w-screen flex-grow flex-col items-center justify-center bg-valence-gray/70"
      >
        {children}
      </motion.div>
    );
  },
);

Overlay.displayName = "Overlay";
