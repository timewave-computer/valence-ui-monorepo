import { cn } from "@/utils";
import { LoadingSkeleton } from "@valence-ui/ui-components";
import Link from "next/link";

const textCellClassName =
  "flex  min-h-12 items-center justify-center px-1.5 py-2 font-mono  text-xs border-x border-valence-lightgray text-nowrap";
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
  blankTarget?: boolean;
}) => {
  if (!href)
    return (
      <div className={cn(textCellClassName, className)}>
        {isLoading ? (
          <LoadingSkeleton className="h-full w-full" />
        ) : (
          <>{children}</>
        )}
      </div>
    );

  const isExternalLink = href.startsWith("http");

  const Comp = isExternalLink ? "a" : Link;

  return (
    <Comp
      href={href}
      {...(isExternalLink ? { target: "_blank" } : {})}
      className={cn(
        textCellClassName,
        href &&
          "underline decoration-valence-lightgray decoration-[1px] underline-offset-4 hover:decoration-valence-gray",
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
