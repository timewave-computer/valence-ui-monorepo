import {
  type ProgramParserResult,
  type AccountBalances,
} from "@/app/programs/server";
import { type Edge, type Node } from "@xyflow/react";
import {
  type TAccountNode,
  type TLibraryNode,
  NodeTypeOptions,
} from "@/app/programs/server";

export type NodeComposerReturnType = {
  edges: Edge[];
  nodes: Node[];
};
export class NodeComposer {
  static generate = ({
    program,
    accountBalances,
  }: {
    program: Pick<ProgramParserResult, "accounts" | "libraries" | "links">;
    accountBalances: AccountBalances;
  }): NodeComposerReturnType => {
    return {
      nodes: [
        ...makeAccountNodes(program.accounts, accountBalances),
        ...makeLibraryNodes(program.libraries),
      ],
      edges: makeEdges(program.links),
    };
  };
}
const makeAccountNodes = (
  accounts: ProgramParserResult["accounts"],
  balancesData: AccountBalances,
) => {
  return Object.entries(accounts).map(([id, account]) => {
    const balances = balancesData.find(
      (balance) => balance.address === account.addr,
    );
    if (!balances) {
      throw new Error("Error fetching balanaces for account " + account.addr);
    }
    return {
      id: `account:${id}`,
      type: NodeTypeOptions.account,
      position: { x: 0, y: 0 },
      data: {
        id: id,
        balances,
        accountType: account.ty,
        domain: account.domain,
        address: account.addr,
      },
    } as TAccountNode;
  });
};

const makeLibraryNodes = (libraries: ProgramParserResult["libraries"]) => {
  return Object.entries(libraries).map(
    ([id, library]) =>
      ({
        id: `library:${id}`,
        type: NodeTypeOptions.library,
        position: { x: 0, y: 0 },
        data: {
          id: id,
          config: library.config,
          domain: library.domain,
          address: library.addr,
        },
      }) as TLibraryNode,
  );
};

const makeEdges = (links: ProgramParserResult["links"]) => {
  const edges: Edge[] = [];
  Object.entries(links).forEach(([id, link]) => {
    link.input_accounts_id.forEach((inputAccountId) => {
      edges.push({
        id: `edge-link:${id}-source:${inputAccountId}-target:${link.library_id}`,
        source: `account:${inputAccountId}`,
        target: `library:${link.library_id}`,
      });
    });
    link.output_accounts_id.forEach((outputAccountId) => {
      edges.push({
        id: `edge-link:${id}-source:${link.library_id}-target:${outputAccountId}`,
        source: `library:${link.library_id}`,
        target: `account:${outputAccountId}`,
      });
    });
  });

  return edges;
};
