"use client";
import {
  isPermissionless,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import {
  cn,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Heading,
  Label,
} from "@valence-ui/ui-components";
import {
  displayAuthMode,
  displaySubroutineType,
  ExecutableSubroutine,
  getSubroutine,
} from "@/app/programs/ui";

export const SubroutineDisplay = ({
  program,
}: {
  program: GetProgramDataReturnValue;
}) => {
  return (
    <div>
      {program.authorizations.map((authorization, i) => {
        const subroutine = getSubroutine(authorization.subroutine);
        const functions = subroutine.functions;
        const isAuthorized = isPermissionless(authorization.mode);

        return (
          <CollapsibleSectionRoot
            key={`authorization-${authorization.label}-${i}`}
            className={cn(
              i === 0 && program.authorizations.length > 1 && "border-b-0",
            )}
            variant="primary"
            defaultIsOpen={false}
          >
            <CollapsibleSectionHeader>
              <Heading level="h3">{authorization.label.toUpperCase()}</Heading>
            </CollapsibleSectionHeader>
            <CollapsibleSectionContent>
              <div className="flex flex-row gap-2 pb-4">
                <Label>{displayAuthMode(authorization.mode)}</Label>
                {
                  <Label>
                    {displaySubroutineType(authorization.subroutine)}
                  </Label>
                }
              </div>
              <ExecutableSubroutine
                key={`subroutine-${authorization.label}-${i}`}
                functions={functions}
                isAuthorized={isAuthorized}
              />
            </CollapsibleSectionContent>
          </CollapsibleSectionRoot>
        );
      })}
    </div>
  );
};
