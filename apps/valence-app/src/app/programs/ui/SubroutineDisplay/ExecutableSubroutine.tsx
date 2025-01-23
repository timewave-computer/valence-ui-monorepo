"use client";
import {
  Button,
  cn,
  FormRoot,
  FormSubmit,
  Heading,
  PrettyJson,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import {
  FunctionMessageFormField,
  generateMessageBody,
  jsonToIndentedText,
} from "@/app/programs/ui";
import { useForm } from "react-hook-form";
import { AtomicFunction, NonAtomicFunction } from "@valence-ui/generated-types";

export interface SubroutineMessageFormValues {
  messages: string[];
}
export const ExecutableSubroutine = ({
  functions,
  isAuthorized,
}: {
  functions: NonAtomicFunction[] | AtomicFunction[];
  isAuthorized: boolean;
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
    <div>
      <FormRoot
        onSubmit={(e) => {
          e.preventDefault();
          const vals = getValues();
          return handleExecuteMessage(vals);
        }}
      >
        <div className="flex flex-col gap-4">
          {functions?.map((func, i) => {
            return (
              <div
                className={cn(i === 0 && functions.length > 1 && "border-b-0")}
                key={`function-${func.contract_address}-${i}`}
              >
                <Heading level="h4"> Function Name</Heading>
                {/* this is its own component to simplify custom error handling */}
                <FunctionMessageFormField
                  fieldName={`messages.${i}`}
                  form={form}
                  subroutineFunction={func}
                  isAuthorized={isAuthorized}
                />

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    resetField(`messages.${i}`);
                  }}
                  size="sm"
                  className="mt-2"
                  variant="secondary"
                >
                  Reset
                </Button>
              </div>
            );
          })}
        </div>
        <FormSubmit className="mt-4" asChild>
          <Button disabled={!isAuthorized}>Execute</Button>
        </FormSubmit>
      </FormRoot>
    </div>
  );
};
