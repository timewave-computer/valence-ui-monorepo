import { cn } from "@/utils";

export const WarnText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => (
  <div
    role="gridcell"
    className={cn(
      "col-span-full flex w-full items-center font-mono text-sm   font-medium  tracking-wide text-valence-gray  ",
      className,
    )}
  >
    {text}
  </div>
);
