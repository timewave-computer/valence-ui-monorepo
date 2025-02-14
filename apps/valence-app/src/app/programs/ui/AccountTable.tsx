import {
  CellType,
  Heading,
  Table,
  type TableColumnHeader,
  Label,
  LinkText,
} from "@valence-ui/ui-components";
import {
  type ProgramParserResult,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import { displayAccountName, displayDomain } from "@/app/programs/ui";
import { CelatoneUrl } from "@/const";
import { useAssetMetadata } from "@/app/rebalancer/ui";
import { displayAddress, displayNumberV2, microToBase } from "@/utils";

export const AccountTable = ({
  program,
}: {
  program?: GetProgramDataReturnValue;
}) => {
  const { getOriginAsset } = useAssetMetadata();

  const accounts = Object.values(program?.parsedProgram?.accounts ?? {});
  console.log("accts", program?.parsedProgram?.accounts);

  return (
    <div className="p-2 flex flex-col gap-4">
      {accounts?.map((account) => {
        const balances = program?.balances?.filter(
          ({ address: balanceAddress }) => {
            balanceAddress === account.addr;
          },
        );
        const data = balances
          ?.map(({ address, balances }) => {
            const account = getAccount(
              address,
              program?.parsedProgram?.accounts,
            );
            return [
              ...balances.map((balance) => {
                const asset = getOriginAsset(balance.denom);
                if (!asset) {
                  throw new Error(
                    `Asset not found: ${balance.denom} on ${account?.chainId}`,
                  );
                }

                return {
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
                };
              }),
            ];
          })
          .flat();
        return (
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <Heading level="h4">{displayAccountName(account.name)}</Heading>
                {account.addr && (
                  <LinkText
                    blankTarget={true}
                    className="font-mono text-xs"
                    variant={"secondary"}
                    href={CelatoneUrl.contract(account.addr)}
                  >
                    {displayAddress(account.addr)}
                  </LinkText>
                )}
              </div>

              <Label>{displayDomain(account.domain)}</Label>
            </div>

            <Table
              variant="secondary"
              className="-m-2"
              headers={headers}
              data={data ?? []}
            />
          </div>
        );
      })}
    </div>
  );
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
    key: "denom",
    label: "Denom",
    cellType: CellType.Text,
  },
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
];
