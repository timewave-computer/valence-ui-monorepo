"use client";

import {
  Button,
  cn,
  FormField,
  FormRoot,
  FormSubmit,
  Heading,
  InputLabel,
  PrettyJson,
  TextAreaInput,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import { generateMessageBody } from "@/app/programs/ui";
import { useForm } from "react-hook-form";
import { AtomicFunction, NonAtomicFunction } from "@valence-ui/generated-types";

interface SubroutineMessageFormValues {
  messages: string[];
}
export const ExecutableSubroutine = ({
  functions,
  isAuthorized,
}: {
  functions: NonAtomicFunction[] | AtomicFunction[];
  isAuthorized: boolean;
}) => {
  const { watch, setValue, getValues, register, resetField } =
    useForm<SubroutineMessageFormValues>({
      defaultValues: {
        messages: functions.map((subroutineFunction) => {
          return jsonToIndentedText(
            generateMessageBody(subroutineFunction.message_details),
          );
        }),
      },
    });

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
        <ToastMessage variant="error" title="Failed to execute messages">
          {" "}
          {e.message}{" "}
        </ToastMessage>,
      );
      console.log("error", e);
    }
  };
  const vals = watch();

  return (
    <div>
      <FormRoot
        onSubmit={(e) => {
          console.log("in form submit");
          e.preventDefault();
          const vals = getValues();
          return handleExecuteMessage(vals);
        }}
      >
        <div className="flex flex-col gap-4">
          {functions?.map((func, i) => {
            const messageBody = generateMessageBody(func.message_details);
            const textAreaSize = Math.min(34, countJsonKeys(messageBody) + 4);
            const textareaRef = register(`messages.${i}`, { required: true });

            return (
              <div
                className={cn(i === 0 && functions.length > 1 && "border-b-0")}
                key={`function-${func.contract_address}-${i}`}
              >
                <Heading level="h4"> Function Name</Heading>

                <FormField name={`messages.${i}`}>
                  <InputLabel label="Message" size="sm" />
                  <TextAreaInput
                    placeholder="{/n}"
                    value={vals.messages[i]}
                    ref={textareaRef.ref}
                    name={`messages.${i}`}
                    onChange={(e) => {
                      setValue(`messages.${i}`, e.target.value);
                    }}
                    size="sm"
                    rows={textAreaSize}
                    isDisabled={!isAuthorized}
                  />
                </FormField>
                <Button
                  onClick={(e) => {
                    console.log("resetting", i);
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

const jsonToIndentedText = (body: object): string => {
  return JSON.stringify(body, null, 2);
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
