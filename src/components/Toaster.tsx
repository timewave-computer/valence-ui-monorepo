"use client";

import React, { ReactNode } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner {...props} />;
};

export const ToastMessage: React.FC<{
  title: string;
  variant?: "info" | "success" | "error";
  children?: string | React.ReactNode;
}> = ({ title, children, variant = "info" }) => {
  let titleBody: ReactNode;
  switch (variant) {
    case "success":
      titleBody = (
        <h1 className="text-lg font-semibold text-valence-blue">{title}</h1>
      );
      break;

    case "error":
      titleBody = (
        <h1 className="text-lg font-semibold text-valence-red">{title}</h1>
      );
      break;

    default:
      titleBody = (
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-valence-black">{title}</h1>
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-2">
      {titleBody}
      {children}
    </div>
  );
};
