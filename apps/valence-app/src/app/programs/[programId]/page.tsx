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
  searchParams: Promise<Record<string, string>>;
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
  searchParams: _searchParams,
}: ProgramPageProps) {
  const searchParams = await _searchParams;

  const { queryConfig: parsedQueryConfig } = loadQueryConfigSearchParams(
    searchParams.queryConfig,
  );

  const data = (await getProgramData({
    programId,
    queryConfig: parsedQueryConfig ?? undefined,
  })) as GetProgramDataReturnValue;

  return <ProgramViewer programId={programId} initialData={data} />;
}
