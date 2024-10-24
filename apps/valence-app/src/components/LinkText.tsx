import { cn } from "@/utils";
import Link from "next/link";

export interface LinkTextProps
  extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  openInNewTab?: boolean;
  href: string; // make required
}

export const LinkText = ({
  href,
  children,
  openInNewTab,
  className,
}: LinkTextProps) => {
  openInNewTab ??= href.startsWith("http");

  return openInNewTab ? (
    <a href={href} className={cn(className)} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link className={cn(className)} href={href}>
      {children}
    </Link>
  );
};
