import {
  Domain,
  AccountType,
} from "@valence-ui/generated-types/dist/server/types/ProgramConfigManager.types";
import { AccountBalances, ProgramParserResult } from "@/app/programs/server";
import { type Node } from "@xyflow/react";
import { AccountNode, LibraryNode } from "../../ui/diagram";

type CommonNodeProps = {
  id: string;
  address: string;
  domain: Domain;
};

export type TAccountNode = Node<
  CommonNodeProps & {
    balances: AccountBalances[0];
    accountType: AccountType;
  },
  "account"
>;

export type TLibraryNode = Node<
  CommonNodeProps & {
    config: ProgramParserResult["libraries"][0]["config"];
    isSelected?: boolean;
  }
>;

export enum NodeTypeOptions {
  account = "account",
  library = "library",
}

/***
 * Must be Defined outside of rendering tree so it does not cause uneccessary rerenders
 */
export const nodeTypes = {
  [NodeTypeOptions.account]: AccountNode,
  [NodeTypeOptions.library]: LibraryNode,
};

export function isLibraryNode(node: any): node is TLibraryNode {
  return node && node.type === NodeTypeOptions.library;
}

export function isAccountNode(node: any): node is TAccountNode {
  return node && node.type === NodeTypeOptions.account;
}
