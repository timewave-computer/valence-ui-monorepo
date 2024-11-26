import { cn, PrettyJson } from "@valence-ui/ui-components";
import { Handle, type Position, type NodeProps } from "@xyflow/react";
import { TLibraryNode } from "@/app/programs/server";

export function LibraryNode({ data, id }: NodeProps<TLibraryNode>) {
  return (
    <div
      className={cn(
        "border border-valence-black p-4 bg-valence-white",
        data.isSelected && "bg-valence-blue",
      )}
    >
      <Handle type="target" position={"top" as Position} />

      <h1>Library</h1>
      <PrettyJson data={data} />

      <Handle type="source" position={"bottom" as Position} />
    </div>
  );
}
