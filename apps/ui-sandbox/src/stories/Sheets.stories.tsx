import { Section, Story } from "~/components";
import {
  Button,
  Heading,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@valence-ui/ui-components";

const Buttons = () => (
  <Section>
    <Story>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary">Show Sheet</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <Heading level="h2">Sheet Title</Heading>
          Sheet content.
        </SheetContent>
      </Sheet>
    </Story>
  </Section>
);

export default Buttons;
