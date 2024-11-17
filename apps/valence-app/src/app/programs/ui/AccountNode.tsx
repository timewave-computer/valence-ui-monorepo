import { PrettyJson } from "@valence-ui/ui-components";
import {
  Handle,
  type Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

type AccountNode = Node<{ number: number }, "account">;

export function AccountNode({ data, id }: NodeProps<AccountNode>) {
  return (
    <div className="border border-valence-black rounded-2xl p-2 bg-valence-lightgray">
      <Handle type="target" position={"top" as Position} />

      <h1>Account</h1>
      <p className="text-xs pb-2">id: {id}</p>
      <PrettyJson data={data} />

      <Handle type="source" position={"bottom" as Position} />
    </div>
  );
}
