import { Section, Story } from "~/components";
import { Card, Heading } from "@valence-ui/ui-components";

const Cards = () => (
  <Section className="w-full">
    <Story className="gap-2">
      <Heading level="h2">Card With Data</Heading>
      <Card>
        Quis non ut incididunt ad irure officia duis voluptate. Reprehenderit
        non eiusmod laboris voluptate nostrud sint dolor nulla Lorem.
        Consectetur eu ipsum eiusmod occaecat anim et ullamco nulla mollit
        cupidatat. Eiusmod dolor ipsum ut non exercitation ex do adipisicing
        eiusmod. Officia esse occaecat quis tempor. Non quis do reprehenderit
        eiusmod amet non voluptate excepteur aliquip veniam mollit enim.
      </Card>
    </Story>
    <Story className="gap-2">
      <Heading level="h2">Card Loading</Heading>
      <Card isLoading>
        Quis non ut incididunt ad irure officia duis voluptate. Reprehenderit
        non eiusmod laboris voluptate nostrud sint dolor nulla Lorem.
        Consectetur eu ipsum eiusmod occaecat anim et ullamco nulla mollit
        cupidatat. Eiusmod dolor ipsum ut non exercitation ex do adipisicing
        eiusmod. Officia esse occaecat quis tempor. Non quis do reprehenderit
        eiusmod amet non voluptate excepteur aliquip veniam mollit enim.
      </Card>
    </Story>
  </Section>
);

export default Cards;
