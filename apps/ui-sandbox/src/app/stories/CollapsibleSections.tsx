import { Section, Story } from "~/components";
import {
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Heading,
} from "@valence-ui/ui-components";

const CollapsibleSections = () => (
  <Section className="w-full">
    <Story>
      <CollapsibleSectionRoot defaultIsOpen={false}>
        <CollapsibleSectionHeader>
          <Heading level="h6">Heading</Heading>
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>Content</CollapsibleSectionContent>
      </CollapsibleSectionRoot>
    </Story>
    <Story>
      <CollapsibleSectionRoot variant="primary" defaultIsOpen={false}>
        <CollapsibleSectionHeader>
          <Heading level="h6">Heading</Heading>
        </CollapsibleSectionHeader>
        <CollapsibleSectionContent>Content</CollapsibleSectionContent>
      </CollapsibleSectionRoot>
    </Story>
  </Section>
);

export default CollapsibleSections;
