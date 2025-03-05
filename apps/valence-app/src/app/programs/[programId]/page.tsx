import {
  getProgramData,
  GetProgramDataReturnValue,
  loadQueryConfigSearchParams,
} from "@/app/programs/server";
import { ProgramViewer } from "@/app/programs/ui";
import { sleep } from "@/utils";
import { LoadingSkeleton } from "@valence-ui/ui-components";
import { Suspense } from "react";

export const revalidate = 60;
interface ProgramPageProps {
  params: { programId: string };
  searchParams: Record<string, string>;
}

export default async function ProgramPage(props: ProgramPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ProgramViewerWithSuspense {...props} />
    </Suspense>
  );
}

async function ProgramViewerWithSuspense({
  params: { programId },
  searchParams,
}: ProgramPageProps) {
  const { queryConfig } = await loadQueryConfigSearchParams(searchParams);
  await sleep(10000);
  const data = (await getProgramData({
    programId,
    queryConfig,
  })) as GetProgramDataReturnValue;

  return <ProgramViewer programId={programId} initialData={data} />;
}

const Loading = () => {
  // if page is statically generated this will not show in production
  return (
    <div className="p-4 grow flex flex-col items-start">
      <LoadingSkeleton className="h-[72px]  w-1/5 sm:w-1/3" />
      <div className="flex w-full max-w-[1600px] grow flex-col pt-4">
        <LoadingSkeleton className="h-full w-full grow" />
      </div>
    </div>
  );
};
