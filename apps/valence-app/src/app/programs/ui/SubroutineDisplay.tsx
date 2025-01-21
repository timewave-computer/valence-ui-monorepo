import {
  isPermissionless,
  type GetProgramDataReturnValue,
} from "@/app/programs/server";
import {
  Button,
  cn,
  CollapsibleSectionContent,
  CollapsibleSectionHeader,
  CollapsibleSectionRoot,
  Heading,
  InputLabel,
  Label,
  TextAreaInput,
} from "@valence-ui/ui-components";
import {
  displayAuthMode,
  displaySubroutineType,
  generateMessageBody,
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
            key={`authorization-${authorization.label}`}
            className={cn(
              i === 0 && program.authorizations.length > 1 && "border-b-0",
            )}
            variant="primary"
            defaultIsOpen={false}
          >
            <CollapsibleSectionHeader>
              <Heading level="h3">FunctionName ({authorization.label})</Heading>
            </CollapsibleSectionHeader>
            <CollapsibleSectionContent>
              <div className="flex flex-row gap-2 pt-2">
                <Label>{displayAuthMode(authorization.mode)}</Label>
                {
                  <Label>
                    {displaySubroutineType(authorization.subroutine)}
                  </Label>
                }
              </div>
              <Heading level="h4">Functions</Heading>
              <div>
                {functions?.map((func, i) => {
                  const messageBody = generateMessageBody(func.message_details);
                  const defaultMessage = JSON.stringify(messageBody, null, 2);
                  return (
                    <CollapsibleSectionRoot
                      variant={"primary"}
                      className={cn(
                        i === 0 && functions.length > 1 && "border-b-0",
                      )}
                      key={`function-${func.contract_address}-${i}`}
                    >
                      <CollapsibleSectionHeader className="font-medium text-sm">
                        <Heading level="h5"> Function Name</Heading>
                      </CollapsibleSectionHeader>

                      <CollapsibleSectionContent>
                        <div>
                          <InputLabel label="Message" size="sm" />
                          <TextAreaInput
                            size="sm"
                            rows={Math.min(34, countJsonKeys(messageBody) + 4)}
                            isDisabled={!isAuthorized}
                            defaultValue={defaultMessage}
                          />
                        </div>
                        <Button size="sm" className="pt-1" variant="secondary">
                          Reset Message
                        </Button>
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

function countJsonKeys(obj: any): number {
  let count = 0;

  function countKeys(o: any) {
    if (typeof o === "object" && o !== null) {
      for (const key in o) {
        if (o.hasOwnProperty(key)) {
          count++;
          countKeys(o[key]);
        }
      }
    }
  }

  countKeys(obj);
  return count;
}
