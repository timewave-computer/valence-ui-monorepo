"use client";
import { Section, Story } from "~/components";
import {
  Button,
  Heading,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@valence-ui/ui-components";

const Popovers = () => {
  return (
    <Section>
      <Story>
        <PopoverRoot>
          <PopoverTrigger asChild>
            <Button>Click me</Button>
          </PopoverTrigger>
          <PopoverContent>
            <Heading level="h3">Title</Heading>
            Text
          </PopoverContent>
        </PopoverRoot>
      </Story>
      <Story></Story>
    </Section>
  );
};

export default Popovers;
