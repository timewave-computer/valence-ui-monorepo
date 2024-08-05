import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className=" flex w-full flex-row">
      <div className="w-96 shrink-0 p-4">
        <LoadingSkeleton className="min-h-screen" />
      </div>
      <div className="min-h-screen w-full border-l border-valence-black p-4">
        <LoadingSkeleton className="min-h-screen" />
      </div>
    </div>
  );
}
