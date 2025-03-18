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
  useProgramQueryConfig,
} from "@/app/programs/ui";
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
  const { queryConfig, setQueryConfig } = useProgramQueryConfig(
    initialData.queryConfig,
  );

  const queryConfigUrlParams = {
    main: queryConfig.main,
  };

  const tableData = data?.parsedPrograms?.map(({ id, parsed, raw }) => {
    const authorizationsAddress = parsed.authorizationData?.authorization_addr;

    return {
      id: {
        value: id,
        link: {
          href: `/programs/${id}?queryConfig=${JSON.stringify(queryConfigUrlParams)}`,
          LinkComponent: Link,
          blankTarget: false,
        },
      },
      config: {
        link: "View config",
        body: (
          <>
            <Heading level="h2">Program {id}</Heading>
            <PrettyJson data={raw} />
          </>
        ),
      },
      authorizationsAddress: {
        value: authorizationsAddress ?? "-",

        link: {
          href: authorizationsAddress
            ? CelatoneUrl.contract(authorizationsAddress)
            : "",
        },
      },
      ownerAddress: {
        value: parsed.owner,
        link: {
          href: CelatoneUrl.account(parsed.owner),
        },
      },
      externalDomains: {
        value:
          parsed.domains.external.length > 0
            ? parsed.domains.external.join(", ")
            : "-",
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
      <div className="flex flex-col  gap-2 pt-4 items-stretch overflow-clip">
        <Table
          className="overflow-scroll"
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
    label: "External Domains",
    key: "externalDomains",
    cellType: CellType.Text,
  },
  {
    label: "Config",
    key: "config",
    cellType: CellType.Sheet,
  },
  {
    label: "Owner Address",
    key: "ownerAddress",
    cellType: CellType.Text,
  },
  {
    label: "Authorizations Address",
    key: "authorizationsAddress",
    cellType: CellType.Text,
  },
];
