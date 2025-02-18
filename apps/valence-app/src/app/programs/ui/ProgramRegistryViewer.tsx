"use client";
import {
  Button,
  CellType,
  Heading,
  PrettyJson,
  Sheet,
  SheetContent,
  SheetTrigger,
  Table,
  TableColumnHeader,
} from "@valence-ui/ui-components";
import {
  DEFAULT_QUERY_CONFIG,
  ProgramRpcSettings,
  ProgramViewerErrorDisplay,
  queryArgsAtom,
  RefetchButton,
  useGetAllProgramsQuery,
} from "@/app/programs/ui";
import { displayAddress } from "@/utils";
import { CelatoneUrl } from "@/const";
import Link from "next/link";
import { type GetAllProgramsReturnValue } from "@/app/programs/server";
import { Provider as JotaiProvider } from "jotai";
import { HydrateAtoms } from "@/components";

const ProgramRegistryViewer = ({
  data: initialData,
}: {
  data: GetAllProgramsReturnValue;
}) => {
  const { data, isLoading, refetch, isFetching } = useGetAllProgramsQuery({
    initialQueryData: initialData,
  });

  console.log("data", data);
  const tableData = Object.entries(data?.parsedPrograms ?? {}).map(
    ([id, program]) => {
      const authorizationsAddress =
        program?.authorizationData?.authorization_addr;

      return {
        id: {
          value: id.toString(),

          link: {
            href: `/programs/${id}`,
            LinkComponent: Link,
            blankTarget: false,
          },
        },
        config: {
          link: "View",
          body: (
            <>
              <Heading level="h2">Config</Heading>
              <PrettyJson data={program} />
            </>
          ),
        },
        authorizationsAddress: {
          value: authorizationsAddress
            ? displayAddress(authorizationsAddress)
            : "-",

          link: {
            href: authorizationsAddress
              ? CelatoneUrl.contract(authorizationsAddress)
              : "",
          },
        },
      };
    },
  );
  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <Heading level="h1">Program Registry</Heading>
      <ProgramViewerErrorDisplay errors={data?.errors} />

      <div className="flex flex-row gap-2 items-center pt-2">
        <RefetchButton isFetching={isFetching} refetch={refetch} />
        <ProgramRpcSettings />
        {data?.rawPrograms && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Raw Response</Button>
            </SheetTrigger>
            <SheetContent title="Raw Program" className="w-1/2" side="right">
              <Heading level="h2">Raw Response</Heading>
              <PrettyJson data={data?.rawPrograms} />
            </SheetContent>
          </Sheet>
        )}
      </div>
      <div className="flex flex-col  gap-2 pt-8">
        <Table
          isLoading={isLoading}
          variant="primary"
          headers={headers}
          data={tableData ?? []}
        />
      </div>
    </main>
  );
};

const headers: TableColumnHeader[] = [
  {
    label: "Program ID",
    key: "id",
    cellType: CellType.Text,
  },
  {
    label: "Config",
    key: "config",
    cellType: CellType.Sheet,
  },
  {
    label: "Authorizations Address",
    key: "authorizationsAddress",
    cellType: CellType.Text,
  },
];

export function ProgramRegistryViewerWithStateProvider(
  props: React.ComponentProps<typeof ProgramRegistryViewer>,
) {
  return (
    <JotaiProvider>
      <HydrateAtoms
        initialValues={[
          [queryArgsAtom, props?.data?.queryConfig ?? DEFAULT_QUERY_CONFIG],
        ]}
      >
        <ProgramRegistryViewer {...props} />
      </HydrateAtoms>
    </JotaiProvider>
  );
}
