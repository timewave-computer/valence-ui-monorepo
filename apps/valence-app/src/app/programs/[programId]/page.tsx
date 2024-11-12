/***
 * given ID, fetch all configuration
 *
 * - accounts + balances
 * - make all links
 */

import { Program } from "@/types";

const getProgram = (programId: string): Program => {
  return {
    accounts: [
      {
        id: "1",
        domain: "neutron-1",
        accountType: "base",
      },
      {
        id: "2",
        domain: "neutron-1",
        accountType: "base",
      },
      {
        id: "3",
        domain: "neutron-1",
        accountType: "base",
      },
    ],
    services: [
      {
        id: "1",
        domain: "neutron-1",
        config: {},
      },
      {
        id: "2",
        domain: "neutron-1",
        config: {},
      },
      {
        id: "3",
        domain: "neutron-1",
        config: {},
      },
    ],
    links: [
      {
        id: "1",
        service_id: "1",
        input_accounts_id: ["1", "2"],
        output_accounts_id: ["3"],
      },
    ],
    authorizations: [],
  };
};

export default function ProgramPage({ params: { programId } }) {
  const program = getProgram(programId);

  return <div>{programId}</div>;
}
