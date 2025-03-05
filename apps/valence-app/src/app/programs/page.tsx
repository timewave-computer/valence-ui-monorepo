import {
  ProgramRegistryViewer,
  SuspenseLoadingSkeleton,
} from "@/app/programs/ui";
import {
  getAllProgramsFromRegistry,
  loadQueryConfigSearchParams,
} from "@/app/programs/server";
import { type SearchParams } from "nuqs/server";
import { Suspense } from "react";

export const revalidate = 60;

interface ProgramRegistryPageProps {
  searchParams: SearchParams;
}

export default async function ProgramRegistryPage(
  props: ProgramRegistryPageProps,
) {
  return (
    <Suspense fallback={<SuspenseLoadingSkeleton />}>
      <ProgramRegistryViewerLoader {...props} />
    </Suspense>
  );
}

async function ProgramRegistryViewerLoader({
  searchParams,
}: ProgramRegistryPageProps) {
  const { queryConfig } = await loadQueryConfigSearchParams(searchParams);

  const data = await getAllProgramsFromRegistry({ queryConfig });

  return <ProgramRegistryViewer data={data} />;
}
