import {
  type ProgramService,
  type ProgramAccount,
  type ProgramLink,
  type Program,
} from "@/types";
import { type Edge } from "@xyflow/react";

export const makeNodesAndEdges = (program: Program) => {
  const nodes = [
    ...makeAccountNodes(program.accounts),
    ...makeServiceNodes(program.services),
  ];
  const edges = makeEdges(program.links);
  return { nodes, edges };
};
export type NodesAndEdgesRespose = ReturnType<typeof makeNodesAndEdges>;

const makeAccountNodes = (accounts: ProgramAccount[]) => {
  return accounts.map((account, i) => ({
    id: `account:${account.id}`,
    type: "account",
    position: { x: 0, y: 0 },
    data: {
      label: `account ${account.id}`,
      accountType: account.accountType,
      domain: account.domain,
    },
  }));
};

const makeServiceNodes = (services: ProgramService[]) => {
  return services.map((service, i) => ({
    id: `service:${service.id}`,
    position: { x: 0, y: 0 },
    data: {
      label: `service ${service.id}`,
      config: service.config,
      domain: service.domain,
    },
  }));
};

const makeEdges = (links: ProgramLink[]) => {
  const edges: Edge[] = [];
  links.forEach((link) => {
    link.input_accounts_id.forEach((inputAccountId) => {
      edges.push({
        id: `edge-link:${link.id}-source:${inputAccountId}-target:${link.service_id}`,
        source: `account:${inputAccountId}`,
        target: `service:${link.service_id}`,
      });
    });
    link.output_accounts_id.forEach((outputAccountId) => {
      edges.push({
        id: `edge-link:${link.id}-source:${link.service_id}-target:${outputAccountId}`,
        source: `service:${link.service_id}`,
        target: `account:${outputAccountId}`,
      });
    });
  });
  return edges;
};
