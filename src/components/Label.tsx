import { cn } from "@/utils";

export interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
}

export const Label: React.FC<LabelProps> = ({ text, ...props }) => {
  const { className } = props;
  console.log("className", className);
  return (
    <span
      {...props}
      className={cn(
        "h-fit border-[1px] border-valence-black bg-valence-mediumgray px-1.5 py-0.5 font-mono text-xs text-valence-black",
        className,
      )}
    >
      {text}
    </span>
  );
};
