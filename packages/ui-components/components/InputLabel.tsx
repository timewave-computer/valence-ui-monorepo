import { IconTooltipContent, WithIconAndTooltip } from "./WithIconAndTooltip";

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: string; // text arg so it can be used for the tooltip too
  tooltipContent?: string;
  tooltipChildren?: React.ReactNode; // to give anything other than plaintext
}

export function InputLabel({
  label,
  tooltipContent,
  tooltipChildren,
}: InputLabelProps) {
  return (
    <div className="text-xs font-medium text-nowrap">
      <WithIconAndTooltip
        {...(tooltipContent && {
          tooltipContent: (
            <IconTooltipContent title={label} text={tooltipContent}>
              {tooltipChildren}
            </IconTooltipContent>
          ),
        })}
      >
        {label}
      </WithIconAndTooltip>
    </div>
  );
}
