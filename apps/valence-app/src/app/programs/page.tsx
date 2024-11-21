import { ProgramRegistryTable, ProgramsHero } from "@/app/programs/ui";
import { mockRegistry } from "@/mock-data";

export default function ProgramsHomePage() {
  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <ProgramsHero />
      <div className="flex w-full grow flex-col items-center self-center pt-8 ">
        <ProgramRegistryTable programs={registryContents} />
      </div>
    </main>
  );
}

const registryContents = Object.entries(mockRegistry).map(([id, program]) => ({
  id,
  label: "Program " + id,
  authorizationsAddress: program.authorization_data.authorization_addr,
  adminAddress: program.owner,
}));
