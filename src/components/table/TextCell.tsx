import { cn } from "@/utils";
import { LoadingSkeleton } from "@/components";

export const TextCell = ({
  children,
  className,
  href,
  isLoading,
}: {
  children?: string | React.ReactNode;
  className?: string;
  href?: string;
  isLoading?: boolean;
}) => {
  const Comp = href ? "a" : "div";

  return (
    <Comp
      {...(href ? { href } : {})}
      {...(href ? { target: "_blank" } : {})}
      className={cn(
        "flex min-h-[46px] items-center justify-center px-1.5 py-2 font-mono  text-xs",
        "border-x border-valence-lightgray",
        "text-nowrap",
        href &&
          "underline decoration-valence-lightgray decoration-[1.6px] underline-offset-4 hover:decoration-valence-gray",
        className,
      )}
    >
      {isLoading ? (
        <LoadingSkeleton className="h-full w-full" />
      ) : (
        <>{children}</>
      )}
    </Comp>
  );
};
