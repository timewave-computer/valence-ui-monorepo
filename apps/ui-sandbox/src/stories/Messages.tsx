"use client";
import { Section, Story } from "~/components";
import { CalloutBox, InfoText } from "@valence-ui/ui-components";

const Messages = () => {
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
      <Story>
        <InfoText size="lg" variant="info">
          This is information you should know
        </InfoText>
      </Story>
      <Story>
        <InfoText size="lg" variant="warn">
          This is information about a warning
        </InfoText>
      </Story>
      <Story>
        <InfoText size="lg" variant="error">
          This is information about an error
        </InfoText>
      </Story>
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

export default Messages;
