import { ProgramRegistryTable, ProgramsHero } from "@/app/programs/ui";

const registryContents = [
  {
    id: "0",
    label: "Mock Program 1",
    authorizationsAddress:
      "neutron1ecelyw9upcv20hzlx54t6hx78hls949a5th07n7d7k545ujnl6lqr0hjxn",
    adminAddress:
      "neutron1sdehhexqcm9tppydg4w5ysdqkzkac0ekcg3473sl635vecd0qq7qkxn67r",
  },
  {
    id: "1",
    label: "Mock Program 2",
    authorizationsAddress:
      "neutron1ecelyw9upcv20hzlx54t6hx78hls949a5th07n7d7k545ujnl6lqr0hjxn",
    adminAddress:
      "neutron1sdehhexqcm9tppydg4w5ysdqkzkac0ekcg3473sl635vecd0qq7qkxn67r",
  },
  {
    id: "2",
    label: "Mock Program 3",
    authorizationsAddress:
      "neutron1ecelyw9upcv20hzlx54t6hx78hls949a5th07n7d7k545ujnl6lqr0hjxn",
    adminAddress:
      "neutron1sdehhexqcm9tppydg4w5ysdqkzkac0ekcg3473sl635vecd0qq7qkxn67r",
  },
];

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
