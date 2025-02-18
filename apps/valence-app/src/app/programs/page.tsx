import { ProgramRegistryViewerWithStateProvider } from "@/app/programs/ui";
import { mockRegistry } from "@/mock-data";
import { getAllProgramsFromRegistry } from "@/app/programs/server";

// mock data
const registryContents = Object.entries(mockRegistry).map(([id, program]) => ({
  id,
  label: "Program " + id,
  authorizationsAddress: program.authorization_data.authorization_addr,
  adminAddress: program.owner,
}));
export default async function ProgramsHomePage() {
  // mock data

  const data = await getAllProgramsFromRegistry({});

  return <ProgramRegistryViewerWithStateProvider data={data} />;
}
