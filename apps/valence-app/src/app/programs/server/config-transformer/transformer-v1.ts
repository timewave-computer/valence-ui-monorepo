import { z } from "zod";
import { TransformerFunction } from "./types";
import { programConfigSchema } from "@valence-ui/generated-types";
import { type Edge } from "@xyflow/react";

type ProgramConfigV1 = z.infer<typeof programConfigSchema>;
export const transformerV1: TransformerFunction<ProgramConfigV1> = (config) => {
  if (!config.id) {
    // should not happen, but its generated as optional in the types, so it needs to get handled
    throw new Error("Program config does not have an ID");
  }
  return {
    nodes: [
      ...makeAccountNodes(config.accounts),
      ...makeLibraryNodes(config.libraries),
    ],
    edges: makeEdges(config.links),
    // for now we just expect same format as the file
    authorizations: config.authorizations,
    authorizationData: config.authorization_data,
    programId: config.id.toString(),
  };
};

const makeAccountNodes = (accounts: ProgramConfigV1["accounts"]) => {
  return Object.entries(accounts).map(([id, account]) => ({
    id: `account:${id}`,
    type: "account",
    position: { x: 0, y: 0 },
    data: {
      id: id,
      accountType: account.ty,
      domain: account.domain,
      address: account.addr,
    },
  }));
};

const makeLibraryNodes = (libraries: ProgramConfigV1["libraries"]) => {
  return Object.entries(libraries).map(([id, library]) => ({
    id: `library:${id}`,
    type: "library",
    position: { x: 0, y: 0 },
    data: {
      id: id,
      config: library.config,
      domain: library.domain,
      address: library.addr,
    },
  }));
};

const makeEdges = (links: ProgramConfigV1["links"]) => {
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
