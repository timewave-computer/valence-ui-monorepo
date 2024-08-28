import React, { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { BsQuestion } from "react-icons/bs";
export const QuestionTooltipContent: React.FC<{
  title?: string;
  subtext?: string;
  children?: ReactNode;
}> = ({ title, subtext, children }) => {
  return (
    <div className="flex flex-col gap-2">
      {children}
      {(subtext || title) && (
        <div className="flex flex-col gap-1">
          {title && <h3 className="text-sm font-bold">{title}</h3>}
          {subtext && <p className="text-xs">{subtext}</p>}
        </div>
      )}
      {children && <div>{children}</div>}
    </div>
  );
};

export const WithQuestionTooltip: React.FC<{
  children: ReactNode;
  tooltipContent: ReactNode;
}> = ({ children, tooltipContent }) => {
  return (
    <div className="flex flex-row  gap-1">
      {children}
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button className=" flex h-4 w-4 flex-col items-center justify-center rounded-full bg-valence-lightgray text-valence-gray transition-all hover:bg-valence-mediumgray hover:text-valence-black">
            <BsQuestion className="h-3 w-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{tooltipContent}</TooltipContent>
      </Tooltip>
    </div>
  );
};
