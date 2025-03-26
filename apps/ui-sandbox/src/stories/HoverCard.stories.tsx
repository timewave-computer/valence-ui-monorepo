"use client";
import { Section, Story } from "~/components";
import {
  Button,
  Heading,
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from "@valence-ui/ui-components";

const HoverCards = () => {
  return (
    <Section id="info text">
      <Story>
        <HoverCardRoot>
          <HoverCardTrigger asChild>
            <Button>Hover me</Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <Heading level="h3">Title</Heading>
            Text
          </HoverCardContent>
        </HoverCardRoot>
      </Story>
    </Section>
  );
};

export default HoverCards;
