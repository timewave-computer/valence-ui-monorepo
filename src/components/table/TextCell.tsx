import { cn } from "@/utils";

export const TextCell = ({
  children,
  className,
  href,
}: {
  children?: string | React.ReactNode;
  className?: string;
  href?: string;
}) => {
  const Comp = href ? "a" : "div";

  return (
    <Comp
      {...(href ? { target: "_blank" } : {})}
      className={cn(
        "flex justify-center px-1.5 py-2 font-mono  text-xs",
        "border-x border-valence-lightgray",
        "text-nowrap",
        href && "hover:border-b-[1.6px] hover:border-valence-black",
        className,
      )}
    >
      {children}
    </Comp>
  );
};
