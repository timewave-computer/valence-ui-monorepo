"use client";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { Toaster as Sonner, toast } from "sonner";
import { cn } from "..";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      style={{
        borderRadius: 0,
      }}
      toastOptions={{
        duration: 6000,
        classNames: {
          toast: "rounded-none",
          closeButton: "bg-valence-white",
        },
      }}
      closeButton={true}
      {...props}
    />
  );
};

export { toast };

const toastVariants = cva("text-h6 font-bold overflow-x-scroll", {
  variants: {
    variant: {
      info: "text-valence-black",

      success: "text-valence-blue",

      error: "text-valence-red",
    },
  },
});

interface ToastMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title: string;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({
  title,
  children,
  variant,
  className,
}) => {
  return (
    <div className="flex flex-col gap-1.5 overflow-x-scroll">
      <div className={cn(toastVariants({ variant, className }))}>{title}</div>
      <div className="flex flex-col gap-1 ">{children}</div>
    </div>
  );
};
