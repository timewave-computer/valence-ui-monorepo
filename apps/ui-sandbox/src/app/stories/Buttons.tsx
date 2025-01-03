import { Section, Story } from "~/components";
import { Button } from "@valence-ui/ui-components";
import { HiMiniArrowLeft, HiMiniArrowRight } from "react-icons/hi2";

const Buttons = () => (
  <Section>
    <Story>
      <Button>Test</Button>
    </Story>
    <Story>
      <Button SuffixIcon={HiMiniArrowRight}>Create a Covenant</Button>
    </Story>
    <Story>
      <Button variant="secondary">Test</Button>
    </Story>
    <Story>
      <Button variant="secondary" PrefixIcon={HiMiniArrowLeft}>
        Go Back
      </Button>
    </Story>

    <Story>
      <Button disabled>Test</Button>
    </Story>

    <Story>
      <Button SuffixIcon={HiMiniArrowRight} disabled>
        Test
      </Button>
    </Story>

    <Story>
      <Button SuffixIcon={HiMiniArrowRight} isLoading>
        Test
      </Button>
    </Story>
  </Section>
);

export default Buttons;
