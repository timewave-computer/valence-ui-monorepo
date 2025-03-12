import {
  CellType,
  Heading,
  Table,
  type TableColumnHeader,
  Label,
  LinkText,
  Copyable,
} from "@valence-ui/ui-components";
import { type GetProgramDataReturnValue } from "@/app/programs/server";
import { displayAccountName, displayDomain } from "@/app/programs/ui";
import { CelatoneUrl } from "@/const";
import { useAssetMetadata } from "@/app/rebalancer/ui";
import { displayAddress, displayNumberV2 } from "@/utils";

export const AccountsTable = ({
  program,
}: {
  program?: GetProgramDataReturnValue;
}) => {
  const { getOriginAsset } = useAssetMetadata();

  const accounts = Object.values(program?.parsedProgram?.accounts ?? {});

  return (
    <div className="p-2 flex flex-col gap-6">
      {accounts?.map((account) => {
        const balances = program?.balances?.filter(
          ({ address: balanceAddress }) => {
            return balanceAddress === account.addr;
          },
        );
        const data = balances
          ?.map(({ balances }) => {
            return [
              ...balances.map((balance) => {
                const asset = getOriginAsset(balance.denom);

                const amount = `${displayNumberV2(parseFloat(balance.amount), {
                  maximumFractionDigits: 0, // its a raw balance
                })}`;
                const symbol = asset?.symbol ?? "-";

                return {
                  denom: {
                    value: balance.denom,
                  },

                  rawBalance: {
                    value: amount,
                  },
                  symbol: {
                    value: symbol,
                  },
                };
              }),
            ];
          })
          .flat();
        return (
          <div
            key={`account-balances-${account.addr}`}
            className="flex flex-col gap-2"
          >
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <Heading level="h4">{displayAccountName(account.name)}</Heading>
                {account.addr && (
                  <Copyable copyText={account.addr}>
                    <LinkText
                      LinkComponent={"div"}
                      className="font-mono text-xs"
                      variant={"secondary"}
                    >
                      {displayAddress(account.addr)}
                    </LinkText>
                  </Copyable>
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

const headers: TableColumnHeader[] = [
  {
    key: "symbol",
    label: "Symbol",
    cellType: CellType.Text,
  },

  {
    key: "denom",
    label: "Denom",
    cellType: CellType.Text,
  },
  {
    key: "rawBalance",
    label: "Raw Balance",
    cellType: CellType.Number,
    align: "right",
  },
];
