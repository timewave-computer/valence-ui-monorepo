import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { RxCross2 } from "react-icons/rx";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetTitle = SheetPrimitive.Title;

const SheetDescription = SheetPrimitive.Description;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn("fixed inset-0 z-10 bg-black/30", className)}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed  z-20 flex flex-col gap-4 bg-valence-white border-valence-black p-6 shadow-md transition ease-in-out text-valence-black overflow-y-scroll overflow-x-scroll ",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b ",
        bottom: "inset-x-0 bottom-0 border-t",
        left: "inset-y-0 left-0 h-full  w-1/3 border-r ",
        right: "inset-y-0 right-0 h-full w-1/3 border-l",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, title, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side, className }))}
      {...props}
    >
      <SheetTitle className="hidden">title</SheetTitle>
      <SheetDescription className="hidden">description</SheetDescription>

      <SheetPrimitive.Close className=" focus:outline-none absolute top-6 right-8">
        <RxCross2 className="h-6 w-6 focus:outline-none" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
};
