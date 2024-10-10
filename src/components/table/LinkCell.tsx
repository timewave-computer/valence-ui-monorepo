import { cn } from "@/utils";

export const LinkCell = ({
  children,
  className,
  href,
}: {
  children?: string;
  className?: string;
  href: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      className={cn(
        "flex justify-center px-1 py-2 font-mono text-xs",
        "border-x border-valence-lightgray",
        className,
      )}
    >
      <div className="border-b-[1.6px] border-valence-lightgray hover:border-b-[1.6px] hover:border-valence-mediumgray">
        {children}
      </div>
    </a>
  );
};
