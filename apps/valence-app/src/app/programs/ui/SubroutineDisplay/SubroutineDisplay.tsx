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
        const isAtomic =
          displaySubroutineType(authorization.subroutine) === "ATOMIC";

        return (
          <CollapsibleSectionRoot
            key={`authorization-${authorization.label}-${i}`}
            className={cn(
              program.authorizations.length > 1 &&
                i !== program.authorizations.length - 1 &&
                "border-b-0",
            )}
            variant="primary"
            defaultIsOpen={false}
          >
            <CollapsibleSectionHeader>
              <Heading level="h3">{authorization.label.toUpperCase()}</Heading>
            </CollapsibleSectionHeader>
            <CollapsibleSectionContent>
              <div className="flex flex-row gap-2 pb-4">
                <Label variant={isAtomic ? "teal" : "purple"}>
                  {displaySubroutineType(authorization.subroutine)}
                </Label>
                <Label>{displayAuthMode(authorization.mode)}</Label>
              </div>
              {/* separate component because each subroutine should have its own useForm instantiation */}
              <ExecutableSubroutine
                isAtomic={isAtomic}
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
