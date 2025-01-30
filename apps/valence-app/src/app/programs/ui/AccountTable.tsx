import {
  CellType,
  Table,
  type TableColumnHeader,
} from "@valence-ui/ui-components";
import {
  type ProgramParserResult,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { displayDomain } from "@/app/programs/ui";
import { CelatoneUrl } from "@/const";
import { useAssetMetadata } from "@/app/rebalancer/ui";
import { displayNumberV2, microToBase } from "@/utils";

export const AccountTable = ({
  program,
}: {
  program?: GetProgramDataReturnValue;
}) => {
  const { getOriginAsset } = useAssetMetadata();

  const data = program?.balances
    ?.map(({ address, balances }) => {
      const account = getAccount(address, program?.parsedProgram?.accounts);
      return [
        ...balances.map((balance) => {
          const asset = getOriginAsset(balance.denom);
          if (!asset) {
            throw new Error(
              `Asset not found: ${balance.denom} on ${account?.chainId}`,
            );
          }

          return {
            label: {
              value: account?.name ?? "",
            },
            domain: {
              value: account?.domain ? displayDomain(account.domain) : "",
            },
            balances: {
              value: displayNumberV2(
                microToBase(balance.amount, asset.decimals),
                {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 2,
                },
              ),
            },
            symbol: {
              value: asset.symbol ?? "",
            },
            address: {
              value: address,
              link: {
                href: CelatoneUrl.contract(address),
              },
            },
          };
        }),
      ];
    })
    .flat();

  return <Table variant="secondary" headers={headers} data={data ?? []} />;
};

const getAccount = (
  address: string,
  accounts?: ProgramParserResult["accounts"],
) => {
  if (!accounts) {
    return undefined;
  }
  const accts = Object.values(accounts);
  const account = accts.find((account) => account.addr === address);
  return account;
};

const headers: TableColumnHeader[] = [
  {
    key: "symbol",
    label: "Symbol",
    cellType: CellType.Text,
  },
  {
    key: "balances",
    label: "Balance",
    cellType: CellType.Number,
    align: "right",
  },

  {
    key: "label",
    label: "Account",
    cellType: CellType.Text,
  },
  {
    key: "domain",
    label: "Domain",
    cellType: CellType.Text,
  },
  {
    key: "address",
    label: "Account Address",
    cellType: CellType.Text,
  },
];
