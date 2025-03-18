import {
  getProgramData,
  GetProgramDataReturnValue,
  loadQueryConfigSearchParams,
} from "@/app/programs/server";
import { ProgramViewer, SuspenseLoadingSkeleton } from "@/app/programs/ui";
import { Suspense } from "react";

export const revalidate = 60;

interface ProgramPageProps {
  params: { programId: string };
  searchParams: Record<string, string>;
}

export default async function ProgramPage(props: ProgramPageProps) {
  return (
    <Suspense fallback={<SuspenseLoadingSkeleton />}>
      <ProgramViewerLoader {...props} />
    </Suspense>
  );
}

async function ProgramViewerLoader({
  params: { programId },
  searchParams,
}: ProgramPageProps) {
  const { queryConfig } = await loadQueryConfigSearchParams(searchParams);
  const data = (await getProgramData({
    programId,
    queryConfig: queryConfig ?? undefined,
  })) as GetProgramDataReturnValue;

  return <ProgramViewer programId={programId} initialData={data} />;
}
