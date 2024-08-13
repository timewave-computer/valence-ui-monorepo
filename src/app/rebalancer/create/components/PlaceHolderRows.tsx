import { cn } from "@/utils";

export const PlaceholderRows = ({ length }: { length: number }) => {
  if (length >= 1) return;

  return (
    <WarnText
      className="font-mono text-valence-gray"
      text="Input at least one starting amount in Step 1 to continue"
    />
  );
};

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
