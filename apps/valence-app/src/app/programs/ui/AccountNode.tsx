import {
  Handle,
  type Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

type AccountNode = Node<{ number: number }, "account">;

export function AccountNode({ data, id }: NodeProps<AccountNode>) {
  return (
    <div className="border border-valence-black rounded-lg p-2 bg-valence-lightgray">
      <Handle type="target" position={"top" as Position} />

      <h1>Account</h1>
      <p className="text-xs pb-2">id:Account {id}</p>
      <pre className="break-words text-xs whitespace-pre-wrap">
        {JSON.stringify({ data }, null, 1)}
      </pre>

      <Handle type="source" position={"bottom" as Position} />
    </div>
  );
}
