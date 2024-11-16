import {
  Handle,
  type Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

type LibraryNode = Node<{ number: number }, "library">;

export function LibraryNode({ data, id }: NodeProps<LibraryNode>) {
  return (
    <div className="border border-valence-black p-4 bg-valence-white ">
      <Handle type="target" position={"top" as Position} />

      <h1>Library</h1>
      <p className="text-xs pb-2">id: {id}</p>
      <pre className="break-words text-xs whitespace-pre-wrap">
        {JSON.stringify({ data }, null, 1)}
      </pre>

      <Handle type="source" position={"bottom" as Position} />
    </div>
  );
}
