import { Section, Story } from "~/components";
import { Heading, LinkText } from "@valence-ui/ui-components";

const Typography = () => (
  <Section>
    <>
      <Story>
        <Heading level="h1">Heading 1</Heading>
      </Story>
      <Story>
        <Heading level="h2">Heading 2</Heading>
      </Story>
      <Story>
        <Heading level="h3">Heading 3</Heading>
      </Story>
      <Story>
        <Heading level="h4">Heading 4</Heading>
      </Story>
      <Story>
        <Heading level="h5">Heading 5</Heading>
      </Story>
      <Story>
        <Heading level="h6">Heading 6</Heading>
      </Story>

      <Story>
        <p>Paragraph</p>
      </Story>
      <Story>
        <p className="text-sm">Paragraph small</p>
      </Story>
      <Story>
        <LinkText variant="primary" href="#">
          Primary link
        </LinkText>
      </Story>
      <Story>
        <LinkText variant="secondary" href="#">
          Secondary link
        </LinkText>
      </Story>
      <Story>
        <LinkText variant="highlighted" href="#">
          Highlighted link
        </LinkText>
      </Story>
      <Story>
        <p className="font-mono">data</p>
      </Story>
      <Story>
        <p className="font-mono text-sm">data small</p>
      </Story>
    </>
  </Section>
);

export default Typography;
