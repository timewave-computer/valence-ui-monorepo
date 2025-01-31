"use client";
import { Section, Story } from "~/components";
import { PrettyJson } from "@valence-ui/ui-components";

const sampleData = {
  description: "print JSON  with indents, font styles, text wrap, etc",
  id: 2,
  owner: "neutron1hj5fveer5cjtn4wd6wstzugjfdxzl0xpznmsky",
  links: {
    "0": {
      input_accounts_id: [0],
      output_accounts_id: [1],
      library_id: 0,
    },
  },
  accounts: {
    "0": {
      name: "base_account_1",
      ty: {
        Addr: {
          addr: "neutron1dtueann60wu9w9eaca73h43kq0qvvl9kjxzxge84x73h2dd5pfmq0rkc4x",
        },
      },
      domain: {
        CosmosCosmwasm: "neutron",
      },
      addr: "neutron173hvzyja4447jlqkkvjdejjwlwk9eaam27q2psm3evy70f7z34pq5247np",
    },
  },
};
const PrettyJsonStory = () => {
  return (
    <Section id="pretty json">
      <Story>
        <PrettyJson data={sampleData} />
      </Story>
    </Section>
  );
};

export default PrettyJsonStory;
