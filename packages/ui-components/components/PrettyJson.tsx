import { cn } from "../utils";

interface JsonTextProps extends React.HTMLAttributes<HTMLPreElement> {
  data?: { [key: string]: any } | string;
}

export const PrettyJson = ({ data, className, ...props }: JsonTextProps) => {
  return (
    <pre
      {...props}
      className={cn(
        "break-words text-xs whitespace-pre-wrap text-left",
        className,
      )}
    >
      {JSON.stringify(data, null, 1)}
    </pre>
  );
};
