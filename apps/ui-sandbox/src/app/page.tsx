import { Story } from "@/components/Story";
import { Section } from "@/components/Section";

import { Button, Heading } from "@valence-ui/ui-components";

export default function Home() {
  return (
    <div>
      <Typography />

      <Buttons />
    </div>
  );
}

const Buttons = () => (
  <Section label="Button" className="flex flex-row">
    <>
      <Story label="primary">
        <Button>Test</Button>
      </Story>{" "}
      <Story label="secondary">
        <Button variant="secondary">Test</Button>
      </Story>
      <Story label="loading">
        <Button isLoading>Test</Button>
      </Story>
      <Story label="disabled">
        <Button disabled>Test</Button>
      </Story>
    </>
  </Section>
);

const Typography = () => (
  <Section label="Typography">
    <>
      <Story label="h1">
        <Heading level="h1">Heading 1</Heading>
      </Story>
      <Story label="h2">
        <Heading level="h2">Heading 2</Heading>
      </Story>
      <Story label="h3">
        <Heading level="h3">Heading 3</Heading>
      </Story>
      <Story label="h4">
        <Heading level="h4">Heading 4</Heading>
      </Story>
      <Story label="h5">
        <Heading level="h5">Heading 5</Heading>
      </Story>
      <Story label="h6">
        <Heading level="h6">Heading 6</Heading>
      </Story>

      <Story label="p">
        <p>Paragraph</p>
      </Story>
      <Story label="p small">
        <p className="text-sm">Paragraph small</p>
      </Story>
      <Story label="data">
        <p className="font-mono">data</p>
      </Story>
      <Story label="data small">
        <p className="font-mono text-sm">data small</p>
      </Story>
    </>
  </Section>
);
