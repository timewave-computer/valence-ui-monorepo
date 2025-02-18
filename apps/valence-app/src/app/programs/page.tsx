import { ProgramRegistryViewer } from "@/app/programs/ui";
import {
  getAllProgramsFromRegistry,
  loadSearchParams,
} from "@/app/programs/server";
import { type SearchParams } from "nuqs/server";

export default async function ProgramRegistryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { queryConfig } = await loadSearchParams(searchParams);

  const data = await getAllProgramsFromRegistry({ queryConfig });

  return <ProgramRegistryViewer data={data} />;
}
