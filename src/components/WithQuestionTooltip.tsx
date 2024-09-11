import React, { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { BsQuestion } from "react-icons/bs";
import { useIsServer } from "@/hooks";

export const QuestionTooltipContent: React.FC<{
  title?: string;
  text?: string;
  children?: ReactNode;
}> = ({ title, text, children }) => {
  return (
    <div className="flex max-w-64 flex-col  gap-2">
      {(text || title) && (
        <div className="flex flex-col gap-2">
          {title && <h3 className="text-base font-bold">{title}</h3>}
          {text && <p className="text-wrap  text-sm font-normal">{text}</p>}
        </div>
      )}
      {children && <div className="text-sm font-normal">{children}</div>}
    </div>
  );
};

export const WithQuestionTooltip: React.FC<{
  children: ReactNode;
  tooltipContent: ReactNode;
}> = ({ children, tooltipContent }) => {
  const isServer = useIsServer();

  if (isServer) {
    return (
      <div className="flex flex-row  gap-1">
        {children}
        <button className=" flex h-4 w-4 flex-col items-center justify-center rounded-full bg-valence-lightgray text-valence-gray transition-all hover:bg-valence-mediumgray hover:text-valence-black">
          <BsQuestion className="h-3 w-3" />
        </button>
      </div>
    );
  }

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
