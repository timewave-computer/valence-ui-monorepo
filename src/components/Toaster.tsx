"use client";

import React, { ReactNode } from "react";
import { Toaster as Sonner } from "sonner";
import { LinkText } from "./LinkText";
import { CelatoneUrl } from "@/const/celatone";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner {...props} />;
};

export const ToastMessage: React.FC<{
  title: string;
  variant?: "info" | "success" | "error";
  children?: string | React.ReactNode;
  transactionHash?: string;
}> = ({ title, children, variant = "info", transactionHash }) => {
  let titleBody: ReactNode;
  switch (variant) {
    case "success":
      titleBody = (
        <h1 className="text-xl font-semibold text-valence-blue">{title}</h1>
      );
      break;

    case "error":
      titleBody = (
        <h1 className="text-xl font-semibold text-valence-red">{title}</h1>
      );
      break;

    default:
      titleBody = (
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-valence-black">{title}</h1>
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {titleBody}
      <div className="flex flex-col gap-1">{children}</div>

      {transactionHash && (
        <LinkText href={CelatoneUrl.trasaction(transactionHash)}>
          <div className="text-balance border border-valence-black bg-valence-lightgray px-1 py-0.5 font-mono text-xs font-light transition-all hover:underline">
            x{transactionHash}
          </div>
        </LinkText>
      )}
    </div>
  );
};
