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
  const { queryConfig, setQueryConfig } = useQueryArgs(initialData.queryConfig);

  const tableData = data?.parsedPrograms?.map(({ id, config }) => {
    const authorizationsAddress = config.authorizationData?.authorization_addr;

    const sanitizedQueryConfig = {
      ...queryConfig,
      external: !!queryConfig.external?.length
        ? queryConfig.external
        : undefined,
    };

    return {
      id: {
        value: id,
        link: {
          href: `/programs/${id}?queryConfig=${JSON.stringify(sanitizedQueryConfig)}`,
          LinkComponent: Link,
          blankTarget: false,
        },
      },
      config: {
        link: "View config",
        body: (
          <>
            <Heading level="h2">Config</Heading>
            <PrettyJson data={config} />
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
  });
  return (
    <main className="flex grow flex-col bg-valence-white p-4">
      <div className="flex flex-row gap-2 items-center justify-between">
        <LinkText href={`/programs`} LinkComponent={Link} variant="breadcrumb">
          Programs (alpha)
        </LinkText>

        <ProgramRpcSettings
          queryConfig={queryConfig}
          setQueryConfig={setQueryConfig}
        />
      </div>

      <ProgramViewerErrorDisplay errors={data?.errors} />

      <div className="flex flex-row gap-2 w-full  justify-between pt-2">
        <RefetchButton isFetching={isFetching} refetch={refetch} />
      </div>
      <div className="flex flex-col  gap-2 pt-4">
        <Table
          loadingRows={10}
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
    cellType: CellType.Number,
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
