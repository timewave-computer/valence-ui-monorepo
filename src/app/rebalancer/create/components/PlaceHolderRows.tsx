import { cn } from "@/utils";

export const PlaceholderRows = ({ length }: { length: number }) => {
  if (length >= 2) return;
  if (length === 1)
    return (
      <WarnText
        className="text-warn"
        text="Select at least one more asset in Step 1"
      />
    );

  return (
    <WarnText
      className="text-valence-gray"
      text="Select eligible assets in Step 1 to continue"
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
      "col-span-full flex w-full items-center bg-valence-white  text-sm  font-medium tracking-wide  text-valence-black",
      className,
    )}
  >
    {text}
  </div>
);
