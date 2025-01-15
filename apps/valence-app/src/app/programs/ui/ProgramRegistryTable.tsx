import { TableHeader, TableCell } from "@valence-ui/ui-components";
import { CelatoneUrl } from "@/const";
import { displayAddress } from "@/utils";
import { Fragment } from "react";
import Link from "next/link";

type ProgramRegistryItem = {
  id: string;
  label: string;
  authorizationsAddress: string;
  adminAddress: string;
};

const headers = [
  {
    label: "Program ID",
  },
  {
    label: "Label",
  },
  {
    label: "Authorizations Address",
  },
  {
    label: "Admin Address",
  },
];

export const ProgramRegistryTable = ({
  programs,
}: {
  programs: ProgramRegistryItem[];
}) => {
  return (
    <>
      <div className="flex min-h-[72px] flex-col items-center">
        <h1 className="text-h5 font-semibold">Program Registry</h1>
        <div className="w-full max-w-[1600px] pt-4">
          <div className="grid grid-cols-[auto_auto_auto_auto] overflow-x-auto border-x border-b border-valence-black">
            {headers.map((header) => (
              <TableHeader
                key={`program-header-cell-${header.label}`}
                label={header.label}
                ascending={true}
              />
            ))}
            {programs.map((program) => (
              <Fragment key={"program-registry-row-" + program.id}>
                <TableCell
                  link={{
                    href: `/programs/${program.id}`,
                    blankTarget: true,
                    LinkComponent: Link,
                  }}
                >
                  {program.id}
                </TableCell>
                <TableCell
                  link={{
                    href: `/programs/${program.id}`,
                    blankTarget: true,
                    LinkComponent: Link,
                  }}
                >
                  {program.label}
                </TableCell>
                <TableCell
                  link={{
                    href: CelatoneUrl.contract(program.authorizationsAddress),
                    blankTarget: true,
                  }}
                >
                  {displayAddress(program.authorizationsAddress)}
                </TableCell>
                <TableCell
                  link={{
                    href: CelatoneUrl.contract(program.adminAddress),
                    blankTarget: true,
                  }}
                >
                  {displayAddress(program.adminAddress)}
                </TableCell>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
