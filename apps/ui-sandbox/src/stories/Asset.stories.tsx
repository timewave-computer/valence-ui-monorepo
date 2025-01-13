"use client";
import { Section, Story } from "~/components";
import { Asset } from "@valence-ui/ui-components";

const Assets = () => {
  return (
    <Section id="info text">
      <Story>
        <Asset size="sm" color="blue" symbol="SMOL" />
      </Story>
      <Story>
        <Asset color="blue" symbol="MED" />
      </Story>
    </Section>
  );
};

export default Assets;
