"use client";
import { Section, Story } from "~/components";
import { Copyable, LinkText } from "@valence-ui/ui-components";

const Copyables = () => {
  return (
    <Section id="info text">
      <Story>
        <Copyable copyText="neutron1qaaf9lv99pwyeaf7ktw37wetyzpper28j6cltqgw600g3gtsac4s64wtx2">
          <LinkText LinkComponent={"div"} className="font-mono text-xs">
            neutron1qa...wtx2
          </LinkText>
        </Copyable>
      </Story>
      <Story></Story>
    </Section>
  );
};

export default Copyables;
