import { ProgramDiagram } from "@/components";
import {
  ProgramLink,
  ProgramService,
  type Program,
  type ProgramAccount,
} from "@/types";
import Dagre from "@dagrejs/dagre";
import { type Edge } from "@xyflow/react";

const getLayoutedElements = (nodes, edges, options) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => {
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 160,
      height: node.measured?.height ?? 36,
    });
  });

  Dagre.layout(g);

  return {
    options: {
      ...options,
      nodesep: 1000,
    },
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

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

const makeAccountNodes = (accounts: ProgramAccount[]) => {
  return accounts.map((account, i) => ({
    id: `account:${account.id}`,
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

export default function ProgramPage({ params: { programId } }) {
  const program = getProgram(programId);
  const accountNodes = makeAccountNodes(program.accounts);
  const serviceNodes = makeServiceNodes(program.services);
  const edges = makeEdges(program.links);

  const layouted = getLayoutedElements(
    [...accountNodes, ...serviceNodes],
    edges,
    {},
  );

  return (
    <div>
      {/* this div is the container for the diagram */}
      <div className="w-screen h-screen">
        <ProgramDiagram edges={layouted.edges} nodes={layouted.nodes} />
      </div>
    </div>
  );
}
