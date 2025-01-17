import {
  CellType,
  Table,
  type TableColumnHeader,
} from "@valence-ui/ui-components";
import { type GetProgramDataReturnValue } from "@/app/programs/server";
import { displayDomain } from "@/app/programs/ui";
import { CelatoneUrl } from "@/const";

export const AccountTable = ({
  program,
}: {
  program: GetProgramDataReturnValue;
}) => {
  const data = program.balances
    .map(({ address, balances }) => {
      const account = getAccount(address, program.accounts);
      return [
        ...balances.map((balance) => {
          return {
            label: {
              value: account?.name ?? "",
            },
            domain: {
              value: account?.domain ? displayDomain(account.domain) : "",
            },
            balances: {
              value: balance.amount,
            },
            symbol: {
              value: balance.denom,
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

  return <Table variant="secondary" headers={headers} data={data} />;
};

const getAccount = (
  address: string,
  accounts: GetProgramDataReturnValue["accounts"],
) => {
  const accts = Object.values(accounts);
  const account = accts.find((account) => account.addr === address);
  return account;
};

const headers: TableColumnHeader[] = [
  {
    key: "label",
    label: "Label",
    cellType: CellType.Text,
  },
  {
    key: "balances",
    label: "Balance",
    cellType: CellType.Text,
  },
  {
    key: "symbol",
    label: "Symbol",
    cellType: CellType.Text,
  },
  {
    key: "address",
    label: "Address",
    cellType: CellType.Text,
  },
  {
    key: "domain",
    label: "Domain",
    cellType: CellType.Text,
  },
];
