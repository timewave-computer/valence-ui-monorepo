"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          toast: "",
          description: "",
          actionButton: "",
          cancelButton: "",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
