import { ProgramRegistryViewer } from "@/app/programs/ui";
import {
  getAllProgramsFromRegistry,
  loadQueryConfigSearchParams,
} from "@/app/programs/server";
import { type SearchParams } from "nuqs/server";

export default async function ProgramRegistryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { queryConfig } = await loadQueryConfigSearchParams(searchParams);

  const data = await getAllProgramsFromRegistry({ queryConfig });

  return <ProgramRegistryViewer data={data} />;
}
