import { cn } from "@valence-ui/ui-components";

export const HomepageHeadline = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h1
    className={cn(
      "text-[2.027rem] font-mono leading-[3.04rem] font-semibold",
      className,
    )}
  >
    {children}
  </h1>
);
