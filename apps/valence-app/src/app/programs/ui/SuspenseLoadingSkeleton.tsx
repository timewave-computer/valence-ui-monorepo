import { LoadingSkeleton } from "@valence-ui/ui-components";

export const SuspenseLoadingSkeleton = () => {
  // if page is statically generated this will not show in production
  return (
    <div className="p-4 grow flex flex-col items-start">
      <LoadingSkeleton className="h-[72px]  w-1/5 sm:w-1/3" />
      <div className="flex w-full grow flex-col pt-4">
        <LoadingSkeleton className="h-full w-full grow" />
      </div>
    </div>
  );
};
