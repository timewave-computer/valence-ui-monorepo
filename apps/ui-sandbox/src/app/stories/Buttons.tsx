import { Section, Story } from "~/components";
import { Button } from "@valence-ui/ui-components";

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

export default Buttons;
