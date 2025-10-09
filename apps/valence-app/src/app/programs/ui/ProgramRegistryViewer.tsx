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
  Pagination,
  usePagination,
} from "@/app/programs/ui";
import { CelatoneUrl } from "@/const/";
import Link from "next/link";
import {
  ExternalProgramQueryConfig,
  type GetAllProgramsReturnValue,
  ProgramQueryConfig,
} from "@/app/programs/server";

import { ProgramsChainConfig } from "@/const/ProgramsChainConfig";
export const ProgramRegistryViewer = ({
  data: initialData,
}: {
  data: GetAllProgramsReturnValue;
}) => {
  const { pagination, next, previous } = usePagination(initialData.pagination);

  const isPreviousDisabled =
    pagination.lastId ===
    initialData?.parsedPrograms?.[initialData?.parsedPrograms?.length - 1].id;

  const { data, isLoading, refetch, isFetching } = useGetAllProgramsQuery({
    initialQueryData: initialData,
    pagination,
  });

  const { queryConfig, setQueryConfig } = useProgramQueryConfig(
    initialData.queryConfig,
  );

  const mainQueryConfig = queryConfig.main;

  const tableData = data?.parsedPrograms?.map(({ id, parsed, raw }) => {
    const authorizationsAddress = parsed.authorizationData?.authorization_addr;
    const externalDomains = parsed.domains.external;

    const externalDomainQueryConfig: ProgramQueryConfig["external"] =
      externalDomains
        ? externalDomains.reduce((acc, domain) => {
            const supportedChain =
              ProgramsChainConfig.getConfigByDomainName(domain);

            if (supportedChain) {
              acc.push({
                chainId: supportedChain.chainId,
                domainName: domain,
                chainName: supportedChain.chainName,
                rpc: supportedChain.rpc,
              });
            }
            return acc;
          }, [] as ExternalProgramQueryConfig)
        : null;

    const queryConfigForProgram: ProgramQueryConfig = {
      main: mainQueryConfig,
      external: externalDomainQueryConfig,
    };

    return {
      id: {
        value: id,
        link: {
          href: `/programs/${id}?queryConfig=${JSON.stringify(queryConfigForProgram)}`,
          LinkComponent: Link,
          blankTarget: false,
        },
      },
      name: {
        value: parsed.name ?? "-",
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
      <div className="flex flex-row flex-wrap gap-4 items-center justify-between">
        <LinkText href={`/programs`} LinkComponent={Link} variant="breadcrumb">
          Programs (alpha)
        </LinkText>

        <ProgramRpcSettings
          initialQueryConfig={initialData.queryConfig}
          queryConfig={queryConfig}
          setQueryConfig={setQueryConfig}
        />
      </div>

      <ProgramViewerErrorDisplay errors={data?.errors} />

      <div className="flex flex-row gap-2 w-full  justify-between pt-2">
        <div className="flex flex-row gap-2 items-center">
          <RefetchButton isFetching={isFetching} refetch={refetch} />
          <Pagination
            onPrevious={previous}
            onNext={next}
            isPreviousDisabled={isPreviousDisabled}
          />
        </div>
      </div>
      <div className="flex flex-col  gap-2 pt-4 items-stretch overflow-clip">
        <Table
          className="overflow-scroll"
          loadingRows={25}
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
    label: "Name",
    key: "name",
    cellType: CellType.Text,
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
