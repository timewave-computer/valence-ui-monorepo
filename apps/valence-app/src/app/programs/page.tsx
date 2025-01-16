import { ProgramsHero } from "@/app/programs/ui";
import { mockRegistry } from "@/mock-data";
import {
  CellType,
  Heading,
  Table,
  type TableColumnHeader,
} from "@valence-ui/ui-components";
import { CelatoneUrl } from "@/const";
import { displayAddress } from "@/utils";
import Link from "next/link";

// mock data
const registryContents = Object.entries(mockRegistry).map(([id, program]) => ({
  id,
  label: "Program " + id,
  authorizationsAddress: program.authorization_data.authorization_addr,
  adminAddress: program.owner,
}));
export default function ProgramsHomePage() {
  // mock data
  const tableData = registryContents.map((program) => ({
    id: {
      value: program.id,
      link: {
        href: `/programs/${program.id}`,
        LinkComponent: Link,
      },
    },
    label: {
      value: program.label,
      link: {
        href: `/programs/${program.id}`,
        LinkComponent: Link,
      },
    },
    authorizationsAddress: {
      value: displayAddress(program.authorizationsAddress),
      link: {
        href: CelatoneUrl.contract(program.authorizationsAddress),
      },
      adminAddress: {
        value: displayAddress(program.adminAddress),
        link: {
          href: CelatoneUrl.contract(program.adminAddress),
        },
      },
    },
  }));
  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <ProgramsHero />

      <div className="flex flex-col items-center gap-2 pt-8">
        <Heading level="h5">Program Registry</Heading>
        <Table variant="primary" headers={headers} data={tableData} />
      </div>
    </main>
  );
}

const headers: TableColumnHeader[] = [
  {
    label: "Program ID",
    key: "id",
    cellType: CellType.Text,
  },
  {
    label: "Label",
    key: "label",
    cellType: CellType.Text,
  },
  {
    label: "Authorizations Address",
    key: "authorizationsAddress",
    cellType: CellType.Text,
  },
  {
    label: "Admin Address",
    key: "adminAddress",
    cellType: CellType.Text,
  },
];
