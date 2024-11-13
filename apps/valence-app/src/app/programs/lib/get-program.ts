import { type Program } from "@/types";

export const getProgram = (programId: string): Program => {
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
      {
        id: "4",
        domain: "neutron-1",
        accountType: "base",
      },
      {
        id: "5",
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
      {
        id: "4",
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
      {
        id: "3",
        service_id: "3",
        input_accounts_id: ["3"],
        output_accounts_id: ["4"],
      },
      {
        id: "4",
        service_id: "4",
        input_accounts_id: ["4"],
        output_accounts_id: ["5"],
      },
    ],
    authorizations: [],
  };
};
