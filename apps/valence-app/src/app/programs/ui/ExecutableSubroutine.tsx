"use client";

import {
  Button,
  cn,
  FormField,
  FormRoot,
  FormSubmit,
  Heading,
  InfoText,
  InputLabel,
  PrettyJson,
  TextAreaInput,
  toast,
  ToastMessage,
} from "@valence-ui/ui-components";
import { generateMessageBody } from "@/app/programs/ui";
import { useForm } from "react-hook-form";
import { AtomicFunction, NonAtomicFunction } from "@valence-ui/generated-types";
import { useEffect } from "react";

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
  const {
    watch,
    getValues,
    register,
    resetField,
    formState: { errors },
    trigger,
  } = useForm<SubroutineMessageFormValues>({
    defaultValues: {
      messages: functions.map((subroutineFunction) => {
        return jsonToIndentedText(
          generateMessageBody(subroutineFunction.message_details),
        );
      }),
    },
  });

  useEffect(() => {
    // to trigger rerender for validation errors
    const subscription = watch((value, { name, type }) => {
      if (name?.startsWith("messages")) {
        trigger(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

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
            const messageBody = generateMessageBody(func.message_details);
            const textAreaSize = Math.min(34, countJsonKeys(messageBody) + 4);

            return (
              <div
                className={cn(i === 0 && functions.length > 1 && "border-b-0")}
                key={`function-${func.contract_address}-${i}`}
              >
                <Heading level="h4"> Function Name</Heading>

                <FormField name={`messages.${i}`}>
                  <InputLabel label="Message" size="sm" />
                  <TextAreaInput
                    placeholder="{...}"
                    {...register(`messages.${i}`, {
                      validate: {
                        checkValidJson: (value) => {
                          try {
                            JSON.parse(value);
                            return true;
                          } catch (e) {
                            return "Invalid JSON";
                          }
                        },
                      },
                    })}
                    size="sm"
                    rows={textAreaSize}
                    isDisabled={!isAuthorized}
                  />
                  <div>
                    {errors?.messages?.[i]?.type === "checkValidJson" && (
                      <InfoText variant="error">
                        {errors?.messages?.[i]?.message}
                      </InfoText>
                    )}
                  </div>
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
          <Button disabled={!isAuthorized || !!errors.messages?.length}>
            Execute
          </Button>
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
