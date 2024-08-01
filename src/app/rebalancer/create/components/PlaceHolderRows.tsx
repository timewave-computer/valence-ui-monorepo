import { cn } from "@/utils";

export const PlaceholderRows = ({ length }: { length: number }) => {
  if (length >= 2) return;
  if (length === 1)
    return (
      <WarnText className="text-warn" text="Add at least one more asset" />
    );

  return <WarnText className="text-warn" text="Add at least two assets" />;
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
      "col-span-full flex w-full items-center bg-valence-white  text-sm  font-medium tracking-wide  text-valence-black",
      className,
    )}
  >
    {text}
  </div>
);
