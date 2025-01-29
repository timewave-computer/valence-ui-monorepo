import { cn } from "../utils";

export const LoadingSkeleton = ({ className }: { className?: string }) => {
  // You can add any UI inside Loading, including a Skeleton.
  // you will likely need to manually set a height
  return (
    <div
      className={cn("w-full animate-pulse bg-valence-lightgray", className)}
    ></div>
  );
};
