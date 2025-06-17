import {
  ProgramRegistryViewer,
  SuspenseLoadingSkeleton,
} from "@/app/programs/ui";
import {
  GetAllProgramsReturnValue,
  getLastUpdatedTime,
  loadQueryConfigSearchParams,
  ProgramQueryConfig,
  ErrorCodes,
  getDefaultMainChainConfig,
} from "@/app/programs/server";
import { type SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { parsedZkPrograms } from "@/app/programs-zk/const";

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
  const { queryConfig } = loadQueryConfigSearchParams(searchParams);

  const data = await getZkPrograms({ queryConfig });

  return <ProgramRegistryViewer data={data} />;
}

const getZkPrograms = async ({
  queryConfig: userSuppliedQueryConfig,
}: {
  queryConfig: ProgramQueryConfig | null;
}): Promise<GetAllProgramsReturnValue> => {
  const isUserSuppliedArgs = !!userSuppliedQueryConfig;

  const mainDomainConfig = isUserSuppliedArgs
    ? userSuppliedQueryConfig?.main
    : getDefaultMainChainConfig();

  let errors: ErrorCodes = [];

  return {
    dataLastUpdatedAt: getLastUpdatedTime(), // required for useQuery knowing when to refetch
    queryConfig: { main: mainDomainConfig, external: null },
    errors: errors,
    parsedPrograms: parsedZkPrograms,
  };
};
