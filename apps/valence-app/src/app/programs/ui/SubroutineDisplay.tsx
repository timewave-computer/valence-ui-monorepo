import {
  isAtomicSubroutine,
  isNonAtomicSubroutine,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import {
  cn,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Heading,
  Label,
  PrettyJson,
} from "@valence-ui/ui-components";
import { displayAuthMode } from "@/app/programs/ui";

export const SubroutineDisplay = ({
  program,
}: {
  program: GetProgramDataReturnValue;
}) => {
  return (
    <div>
      {program.authorizations.map((authorization, i) => {
        const subroutine = authorization.subroutine;
        const atomicSubroutine = isAtomicSubroutine(subroutine)
          ? subroutine.atomic
          : null;
        const nonAtomicSubroutine = isNonAtomicSubroutine(subroutine)
          ? subroutine.non_atomic
          : null;

        const functions =
          atomicSubroutine?.functions ?? nonAtomicSubroutine?.functions;

        return (
          <CollapsibleSectionRoot
            key={`authorization-${authorization.label}`}
            className={cn(
              i === 0 && program.authorizations.length > 1 && "border-b-0",
            )}
            variant="primary"
            defaultIsOpen={false}
          >
            <CollapsibleSectionHeader>
              <Heading level="h6">FunctionName ({authorization.label})</Heading>
            </CollapsibleSectionHeader>
            <CollapsibleSectionContent>
              <div className="flex flex-row gap-2">
                <Label>{displayAuthMode(authorization.mode)}</Label>
                {<Label>{atomicSubroutine ? "atomic" : "nonatomic"}</Label>}
              </div>

              <Heading level="h7">Functions</Heading>
              <div>
                {functions?.map((func, i) => {
                  return (
                    <CollapsibleSectionRoot
                      variant={"primary"}
                      className={cn(
                        i === 0 && functions.length > 1 && "border-b-0",
                      )}
                      key={`function-${func.contract_address}-${i}`}
                    >
                      <CollapsibleSectionHeader className="font-medium text-sm">
                        <Heading level="h8"> Function Name</Heading>
                      </CollapsibleSectionHeader>
                      <CollapsibleSectionContent>
                        <PrettyJson data={func.message_details} />
                      </CollapsibleSectionContent>
                    </CollapsibleSectionRoot>
                  );
                })}
              </div>
            </CollapsibleSectionContent>
          </CollapsibleSectionRoot>
        );
      })}
    </div>
  );
};
