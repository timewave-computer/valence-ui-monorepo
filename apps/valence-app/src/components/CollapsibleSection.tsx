"use client";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { cn } from "@/utils";
import { FaChevronDown, FaChevronLeft } from "react-icons/fa";

const CollapsibleSectionContext = createContext({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => {},
});

export const CollapsibleSectionRoot: React.FC<{
  children: React.ReactNode;
  defaultIsOpen?: boolean;
}> = ({ defaultIsOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const context = useMemo(
    () => ({
      isOpen,
      setIsOpen,
    }),
    [isOpen],
  );

  return (
    <CollapsibleSectionContext.Provider value={context}>
      <section className="flex w-full flex-col gap-2">{children}</section>
    </CollapsibleSectionContext.Provider>
  );
};

export const CollapsibleSectionHeader = ({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const { isOpen, setIsOpen } = useContext(CollapsibleSectionContext);
  const Icon = isOpen ? FaChevronDown : FaChevronLeft;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={cn("flex flex-row items-center gap-2 pt-2", className)}
      >
        {children}
        <Icon className={cn("h-4 w-4")} />
      </button>
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
