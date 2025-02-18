"use client";
import {
  HoverCard,
  HoverCardContent as Content,
  HoverCardTrigger as Trigger,
} from "@radix-ui/react-hover-card";
import { cn } from "../utils";

type HoverCardRootProps = React.ComponentProps<typeof Content>;
export const HoverCardRoot = ({
  className,
  children,
  ...props
}: HoverCardRootProps) => {
  return (
    <HoverCard {...props} openDelay={0}>
      {children}
    </HoverCard>
  );
};

export const HoverCardTrigger = Trigger;

type HoverCardContentProps = React.ComponentProps<typeof Content>;
export const HoverCardContent = ({
  className,
  children,
  ...props
}: HoverCardContentProps) => {
  return (
    <Content
      {...props}
      className={cn(
        "p-4 bg-valence-white border border-valence-black shadow-sm shadow-valence-gray",
        className,
      )}
    >
      {children}
    </Content>
  );
};
