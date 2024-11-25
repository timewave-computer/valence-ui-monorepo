import { cn, PrettyJson } from "@valence-ui/ui-components";
import {
  Handle,
  type Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";

type LibraryNode = Node<{ number: number }, "library">;

export function LibraryNode({ data, id }: NodeProps<LibraryNode>) {
  return (
    <div
      className={cn(
        "border border-valence-black p-4 bg-valence-white",
        //@ts-ignore
        data.selected && "bg-valence-blue",
      )}
    >
      <Handle type="target" position={"top" as Position} />

      <h1>Library</h1>
      <PrettyJson data={data} />

      <Handle type="source" position={"bottom" as Position} />
    </div>
  );
}
