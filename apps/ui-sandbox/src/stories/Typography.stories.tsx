import { Section, Story } from "~/components";
import { Heading, LinkText } from "@valence-ui/ui-components";

const Typography = () => (
  <Section>
    <>
      <Story label="headings" className="flex flex-col gap-1">
        <Heading level="h1">Heading 1</Heading>
        <Heading level="h2">Heading 2</Heading>
        <Heading level="h3">Heading 3</Heading>
        <Heading level="h4">Heading 4 (also large input label)</Heading>
        <Heading level="h5">Heading 5</Heading>
        <Heading level="h6">Heading 6 (also small input label)</Heading>
      </Story>

      <Story label="text" className="flex flex-col gap-1 pt-2">
        <p>Paragraph</p>
        <p className="text-sm">Paragraph small</p>
        <p className="font-mono">data</p>
        <p className="font-mono text-sm">data small</p>
      </Story>

      <Story label="links" className="flex flex-col gap-1 pt-2">
        <div className="flex flex-row gap-2">
          <LinkText variant="breadcrumb" href="#">
            H1 Breadcrumb
          </LinkText>
          <Heading level="h1">/</Heading>

          <Heading level="h1">Current Page</Heading>
        </div>
        <LinkText variant="primary" href="#">
          Primary link
        </LinkText>
        <LinkText variant="secondary" href="#">
          Secondary link
        </LinkText>
        <LinkText variant="highlighted" href="#">
          Highlighted link
        </LinkText>
      </Story>
    </>
  </Section>
);

export default Typography;
