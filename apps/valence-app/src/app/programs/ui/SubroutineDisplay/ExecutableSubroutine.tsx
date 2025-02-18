"use client";
import {
  Button,
  cn,
  FormRoot,
  FormSubmit,
  Heading,
  LinkText,
  PrettyJson,
  Sheet,
  SheetContent,
  SheetTrigger,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import {
  displayLibraryContractName,
  FunctionMessageFormField,
  generateMessageBody,
  getFunctionLibraryAddress,
  jsonToIndentedText,
  LibraryDetails,
  useLibrarySchema,
} from "@/app/programs/ui";
import { useForm } from "react-hook-form";
import {
  type AtomicFunction,
  type NonAtomicFunction,
} from "@valence-ui/generated-types";
import { CelatoneUrl } from "@/const";
import { displayAddress } from "@/utils";

export interface SubroutineMessageFormValues {
  messages: string[];
}

/**
 * This is itws own component because each subroutine should have its own useForm instantiatio
 */
export const ExecutableSubroutine = ({
  functions,
  isAuthorized,
  isAtomic,
}: {
  functions: NonAtomicFunction[] | AtomicFunction[];
  isAuthorized: boolean;
  isAtomic: boolean;
}) => {
  const form = useForm<SubroutineMessageFormValues>({
    defaultValues: {
      messages: functions.map((subroutineFunction) => {
        return jsonToIndentedText(
          generateMessageBody(subroutineFunction.message_details),
        );
      }),
    },
  });
  const { getValues, resetField } = form;
  const { getLibrarySchema } = useLibrarySchema();

  const handleExecuteMessage = (values: SubroutineMessageFormValues) => {
    try {
      const extractedValues = values.messages.map((msg) => {
        return JSON.parse(msg);
      });
      toast.success(
        <ToastMessage variant="success" title="Messages">
          <PrettyJson data={extractedValues} />
        </ToastMessage>,
      );
    } catch (e) {
      toast.error(
        <ToastMessage variant="error" title="Failed to execute">
          {e.message}
        </ToastMessage>,
      );
      console.log("error", e);
    }
  };

  return (
    <FormRoot
      onSubmit={(e) => {
        e.preventDefault();
        const vals = getValues();
        return handleExecuteMessage(vals);
      }}
    >
      <div
        className={cn(
          "flex flex-col gap-8",
          isAtomic && "border-l-4 border-graph-teal pl-4",
        )}
      >
        {functions?.map((func, i) => {
          const libraryAddress = getFunctionLibraryAddress(func);
          const librarySchema = getLibrarySchema(libraryAddress);
          return (
            <div
              className={cn(
                i === 0 && functions.length > 1 && "border-b-0",
                !isAtomic && "border-l-4 border-graph-purple pl-4",
              )}
              key={`functionfield-${func.contract_address}-${i}`}
            >
              <div className="flex flex-row gap-1 items-center">
                <Heading level="h4">
                  {displayLibraryContractName(
                    librarySchema?.raw?.contract_name,
                  )}
                </Heading>

                <LinkText
                  blankTarget={true}
                  className="font-mono text-xs"
                  variant={"secondary"}
                  href={CelatoneUrl.contract(libraryAddress)}
                >
                  {displayAddress(libraryAddress)}
                </LinkText>
              </div>

              {/* this is its own component to simplify custom error handling */}
              <FunctionMessageFormField
                fieldName={`messages.${i}`}
                form={form}
                subroutineFunction={func}
                isAuthorized={isAuthorized}
              />
              <div className="flex flex-row gap-2 items-center pt-2">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    resetField(`messages.${i}`);
                  }}
                  size="sm"
                  variant="secondary"
                >
                  Reset body
                </Button>

                {librarySchema && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" variant="secondary">
                        View details
                      </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-3/4">
                      <LibraryDetails libraryAddress={libraryAddress} />
                    </SheetContent>
                  </Sheet>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <FormSubmit className="mt-4" asChild>
        <Button disabled={!isAuthorized}>Execute</Button>
      </FormSubmit>
    </FormRoot>
  );
};
