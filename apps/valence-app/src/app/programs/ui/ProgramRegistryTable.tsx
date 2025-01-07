import { SortableTableHeader, TableCell } from "@/components";
import { CelatoneUrl } from "@/const";
import { displayAddress } from "@/utils";
import { Fragment } from "react";

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
        <h1 className="text-xl font-bold">Program Registry</h1>
        <div className="w-full max-w-[1600px] pt-4">
          <div className="grid grid-cols-[auto_auto_auto_auto] overflow-x-auto border-x border-b border-valence-lightgray">
            {headers.map((header) => (
              <SortableTableHeader
                textClassName="font-semibold"
                buttonClassName="border-x  border-y-[1.6px] py-1 px-1.5 flex justify-center text-sm border border-valence-lightgray"
                key={`program-header-cell-${header.label}`}
                label={header.label}
                ascending={true}
              />
            ))}
            {programs.map((program) => (
              <Fragment key={"program-registry-row-" + program.id}>
                <TableCell href={`/programs/${program.id}`}>
                  {program.id}
                </TableCell>
                <TableCell href={`/programs/${program.id}`}>
                  {program.label}
                </TableCell>
                <TableCell
                  href={CelatoneUrl.contract(program.authorizationsAddress)}
                >
                  {displayAddress(program.authorizationsAddress)}
                </TableCell>
                <TableCell href={CelatoneUrl.contract(program.adminAddress)}>
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
