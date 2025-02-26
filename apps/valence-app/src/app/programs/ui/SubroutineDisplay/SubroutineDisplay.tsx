"use client";
import {
  isPermissionless,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import {
  Card,
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
  PermissionsDisplay,
} from "@/app/programs/ui";

export const SubroutineDisplay = ({
  program,
}: {
  program?: GetProgramDataReturnValue;
}) => {
  const authorizations = program?.parsedProgram?.authorizations;
  const authorizationsAddress =
    program?.parsedProgram?.authorizationData?.authorization_addr ?? "";
  if (!authorizations)
    return <Card className="grow h-full">No subroutines to display.</Card>;
  return (
    <div>
      {authorizations.map((authorization, i) => {
        const subroutine = getSubroutine(authorization.subroutine);
        const functions = subroutine.functions;
        const isAuthorized = isPermissionless(authorization.mode);
        const isAtomic =
          displaySubroutineType(authorization.subroutine) === "ATOMIC";

        return (
          <CollapsibleSectionRoot
            key={`authorization-${authorization.label}-${i}`}
            className={cn(
              authorizations.length > 1 &&
                i !== authorizations.length - 1 &&
                "border-b-0",
            )}
            variant="primary"
            defaultIsOpen={false}
          >
            <CollapsibleSectionHeader>
              <Heading level="h3">{authorization.label.toUpperCase()}</Heading>
            </CollapsibleSectionHeader>
            <CollapsibleSectionContent>
              <div className="flex flex-row gap-2 pb-2">
                <Label variant={isAtomic ? "teal" : "purple"}>
                  {displaySubroutineType(authorization.subroutine)}
                </Label>
                <Label>{displayAuthMode(authorization.mode)}</Label>
              </div>

              <div className="pb-2">
                {" "}
                <PermissionsDisplay
                  authorizationsAddress={authorizationsAddress}
                  authorization={authorization}
                />
              </div>

              {/* it's a separate component because each subroutine should have its own useForm instantiation */}
              <ExecutableSubroutine
                authorizationsAddress={authorizationsAddress}
                isAtomic={isAtomic}
                key={`subroutine-${authorization.label}-${i}`}
                functions={functions}
                isAuthorized={true}
              />
            </CollapsibleSectionContent>
          </CollapsibleSectionRoot>
        );
      })}
    </div>
  );
};
