"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { cn } from "../utils";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";
import { cva, VariantProps } from "class-variance-authority";

type VarProps = VariantProps<typeof rootVariants>;

const CollapsibleSectionContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  variant: VarProps["variant"];
}>({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {},
  variant: "primary" as VarProps["variant"],
});

const rootVariants = cva("flex flex-col gap-2 w-full", {
  variants: {
    variant: {
      primary: "p-4 border border-valence-black ",
      secondary: "",
    },
  },
});

const headerVariants = cva("flex flex-row items-center gap-2 cursor-pointer ", {
  variants: {
    variant: {
      primary: "justify-between",
      secondary: "gap-2",
    },
  },
});

interface RootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof rootVariants> {
  children: React.ReactNode;
  defaultIsOpen?: boolean;
}
export const CollapsibleSectionRoot: React.FC<RootProps> = ({
  defaultIsOpen = false,
  children,
  className,
  variant,
}) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const context = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      variant,
    }),
    [isOpen],
  );

  return (
    <CollapsibleSectionContext.Provider
      value={{
        isOpen,
        setIsOpen,
        variant,
      }}
    >
      <section className={cn(rootVariants(context), className)}>
        {children}
      </section>
    </CollapsibleSectionContext.Provider>
  );
};

export const CollapsibleSectionHeader = ({
  children,
  className,
  buttonClassname,
}: {
  children: React.ReactNode;
  className?: string;
  buttonClassname?: string;
}) => {
  const { isOpen, setIsOpen, variant } = useContext(CollapsibleSectionContext);
  const Icon = isOpen ? FaChevronDown : FaChevronLeft;

  return (
    <div
      onClick={() => {
        setIsOpen(!isOpen);
      }}
      className={cn(headerVariants({ className, variant }))}
    >
      {children}
      <Icon className={cn("h-4 w-4", buttonClassname)} />
    </div>
  );
};

export const CollapsibleSectionContent = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isOpen } = useContext(CollapsibleSectionContext);
  return isOpen ? <>{children}</> : null;
};
