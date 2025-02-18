import {
  getProgramData,
  GetProgramDataReturnValue,
  loadSearchParams,
} from "@/app/programs/server";
import { ProgramViewer } from "@/app/programs/ui";

export default async function ProgramPage({
  params: { programId },
  searchParams,
}) {
  const { queryConfig } = await loadSearchParams(searchParams);
  const data = (await getProgramData({
    programId,
    queryConfig,
  })) as GetProgramDataReturnValue;

  return <ProgramViewer programId={programId} initialData={data} />;
}
