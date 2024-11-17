import { cn } from "../utils";

interface JsonTextProps extends React.HTMLAttributes<HTMLPreElement> {
  data?: { [key: string]: any };
}

export const PrettyJson = ({ data, className, ...props }: JsonTextProps) => {
  return (
    <pre
      {...props}
      className={cn("break-words text-xxs whitespace-pre-wrap", cn)}
    >
      {JSON.stringify(data, null, 1)}
    </pre>
  );
};
