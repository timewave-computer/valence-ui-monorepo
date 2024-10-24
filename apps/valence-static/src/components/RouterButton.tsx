"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
/***
 * UNSTLYED utility to add routing in server rendered component
 */
export const RouterButton = ({
  children,
  className,
  options,
}: {
  children: ReactNode;
  className: string;
  options: {
    href?: string;
    back?: boolean;
    refresh?: boolean;
  };
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (options.refresh) {
      router.refresh();
    } else if (options.back) {
      router.back();
    } else if (options.href) router.push(options.href);
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};
