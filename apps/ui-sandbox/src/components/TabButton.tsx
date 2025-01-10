import React, { forwardRef } from "react";
import { Button, cn } from "@valence-ui/ui-components";

interface TabsButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children"> {
  isActive?: boolean;
  state: string;
}

export const TabButton = forwardRef<HTMLButtonElement, TabsButtonProps>(
  ({ isActive, state, onClick }, ref) => {
    return (
      <Button
        ref={ref}
        onClick={onClick}
        className={cn(
          "rounded-2xl",
          isActive &&
            " bg-valence-purple text-valence-white border-valence-white"
        )}
        variant="secondary"
      >
        {state}
      </Button>
    );
  }
);
