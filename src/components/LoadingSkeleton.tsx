import { cn } from "@/utils";

export default function LoadingSkeleton({ className }: { className?: string }) {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div
      className={cn("w-full animate-pulse bg-valence-lightgray", className)}
    ></div>
  );
}
