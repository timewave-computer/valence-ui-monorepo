import { Section, Story } from "~/components";
import { Label } from "@valence-ui/ui-components";

const Labels = () => (
  <Section className="w-full">
    <Story>
      <Label>Sample Text</Label>
    </Story>

    <Story>
      <Label variant="yellow">Sample Text</Label>
    </Story>
    <Story>
      <Label variant="green">Sample Text</Label>
    </Story>
    <Story>
      <Label variant="red">Sample Text</Label>
    </Story>
    <Story>
      <Label variant="purple">Sample Text</Label>
    </Story>
    <Story>
      <Label variant="teal">Sample Text</Label>
    </Story>
  </Section>
);

export default Labels;
