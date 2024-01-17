import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

export type ButtonLinkProps = {
  /**
   * The URL to route to when the button is clicked.
   */
  href: string;
  /**
   * The content of the button.
   */
  children: ReactNode;
  /**
   * An optional class name for the button.
   */
  className?: string;
  /**
   * The style to apply to the button. Defaults to `primary`.
   */
  style?: "primary" | "secondary";
  /**
   * Whether or not to open in a new tab. Defaults to true when the href starts
   * with `http`.
   */
  openInNewTab?: boolean;
};

export const ButtonLink = ({
  href,
  children,
  className: _className,
  style = "primary",
  openInNewTab,
}: ButtonLinkProps) => {
  const className = clsx(
    "text-center py-1.5 px-3 transition",
    {
      "bg-black text-white hover:bg-gray-800": style === "primary",
      "bg-white text-black hover:bg-gray-200 border border-black":
        style === "secondary",
    },
    _className
  );

  openInNewTab ??= href.startsWith("http");

  return openInNewTab ? (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
