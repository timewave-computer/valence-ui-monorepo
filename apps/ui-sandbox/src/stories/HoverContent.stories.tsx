"use client";
import { Section, Story } from "~/components";
import { HoverContent } from "@valence-ui/ui-components";

const HoverContents = () => {
  return (
    <Section id="info text">
      <Story></Story>
      <HoverContent
        title="Hover content title"
        text="This is used in hover tooltips and button popovers"
      >
        This is optional child content
      </HoverContent>
    </Section>
  );
};

export default HoverContents;
