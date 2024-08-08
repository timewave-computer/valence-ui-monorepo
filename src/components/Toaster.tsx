"use client";

import React, { ReactNode } from "react";
import { BsCheck2Circle, BsExclamationCircle } from "react-icons/bs";
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
        <div className="flex items-center gap-2">
          <BsCheck2Circle className="h-5 w-5 text-valence-blue" />
          <h1 className="text-lg font-semibold text-valence-blue">{title}</h1>
        </div>
      );
      break;

    case "error":
      titleBody = (
        <div className="flex items-center gap-2">
          <BsExclamationCircle className="h-5 w-5 text-valence-red" />
          <h1 className="text-lg font-semibold text-valence-red">{title}</h1>
        </div>
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
