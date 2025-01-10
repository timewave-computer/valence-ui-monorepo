"use client";
import { Section, Story } from "~/components";
import { InfoText } from "@valence-ui/ui-components";

/***
 * TODO: tooltip, default values, warnings
 */

const InfoTexts = () => {
  return (
    <Section id="info text">
      <Story>
        <InfoText variant="info">This is information you should know</InfoText>
      </Story>
      <Story>
        <InfoText variant="warn">This is information about a warning</InfoText>
      </Story>
      <Story>
        <InfoText variant="error">This is information about an error</InfoText>
      </Story>
    </Section>
  );
};

export default InfoTexts;
