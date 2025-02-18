"use client";
import {
  CellType,
  Heading,
  LinkText,
  PrettyJson,
  Table,
  TableColumnHeader,
} from "@valence-ui/ui-components";
import {
  ProgramRpcSettings,
  ProgramViewerErrorDisplay,
  RefetchButton,
  useGetAllProgramsQuery,
  useQueryArgs,
} from "@/app/programs/ui";
import { displayAddress } from "@/utils";
import { CelatoneUrl } from "@/const";
import Link from "next/link";
import { type GetAllProgramsReturnValue } from "@/app/programs/server";

export const ProgramRegistryViewer = ({
  data: initialData,
}: {
  data: GetAllProgramsReturnValue;
}) => {
  const { data, isLoading, refetch, isFetching } = useGetAllProgramsQuery({
    initialQueryData: initialData,
  });
  const { queryConfig } = useQueryArgs();

  const tableData = Object.entries(data?.parsedPrograms ?? {}).map(
    ([id, program]) => {
      const authorizationsAddress =
        program?.authorizationData?.authorization_addr;

      return {
        id: {
          value: id.toString(),
          link: {
            href: `/programs/${id}?queryConfig=${JSON.stringify(queryConfig)}`,
            LinkComponent: Link,
            blankTarget: false,
          },
        },
        config: {
          link: "View config",
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
      <LinkText href={`/programs`} LinkComponent={Link} variant="breadcrumb">
        Programs
      </LinkText>

      <ProgramViewerErrorDisplay errors={data?.errors} />

      <div className="flex flex-row gap-2 items-center pt-2">
        <RefetchButton isFetching={isFetching} refetch={refetch} />
        <ProgramRpcSettings />
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
