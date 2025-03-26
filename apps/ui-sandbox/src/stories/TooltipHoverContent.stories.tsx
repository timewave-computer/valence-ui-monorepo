"use client";
import { Section, Story } from "~/components";
import { TooltipHoverContent } from "@valence-ui/ui-components";

const TooltipHoverContents = () => {
  return (
    <Section id="info text">
      <TooltipHoverContent
        title="Hover content title"
        text="This is used in tooltips "
      >
        This is optional child content
      </TooltipHoverContent>
    </Section>
  );
};

export default TooltipHoverContents;
