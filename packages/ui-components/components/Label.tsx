import { cn } from "../utils";

export interface LabelProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
}

export const Label: React.FC<LabelProps> = ({ text, ...props }) => {
  const { className } = props;
  return (
    <span
      {...props}
      className={cn(
        "h-fit bg-valence-mediumgray px-1.5 py-0.5 font-mono text-xs text-valence-black",
        className,
      )}
    >
      {text}
    </span>
  );
};
