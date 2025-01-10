"use client";
import { Section, Story } from "~/components";
import { CalloutBox } from "@valence-ui/ui-components";

/***
 * TODO: tooltip, default values, warnings
 */

const InfoTexts = () => {
  return (
    <Section id="info text">
      <Story>
        <CalloutBox title="Here is info" variant="info">
          This is information you should know
        </CalloutBox>
      </Story>
      <Story>
        <CalloutBox title="Here is a warning" variant="warn">
          This is information about a warning
        </CalloutBox>
      </Story>
      <Story>
        <CalloutBox title="Here is an error" variant="error">
          This is information about an error
        </CalloutBox>
      </Story>
    </Section>
  );
};

export default InfoTexts;
