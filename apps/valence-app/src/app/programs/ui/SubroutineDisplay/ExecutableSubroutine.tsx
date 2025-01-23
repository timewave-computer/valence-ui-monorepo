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
import {
  countJsonKeys,
  generateMessageBody,
  jsonToIndentedText,
  validateJsonWithRestrictions,
} from "@/app/programs/ui";
import { useForm } from "react-hook-form";
import {
  AtomicFunction,
  NonAtomicFunction,
  ParamRestriction,
} from "@valence-ui/generated-types";
import { useEffect, useState } from "react";

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
  const {
    watch,
    getValues,
    register,
    resetField,
    formState: { errors },
    setValue,
  } = useForm<SubroutineMessageFormValues>({
    criteriaMode: "all", // lets you add multiple errors per field
    defaultValues: {
      messages: functions.map((subroutineFunction) => {
        return jsonToIndentedText(
          generateMessageBody(subroutineFunction.message_details),
        );
      }),
    },
  });

  const [customErrors, setCustomErrors] = useState<CustomErrors>({});

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

  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      console.log("watched", value);
    });
    return () => unsubscribe();
  }, [watch]);

  const handleValidateJson = ({
    value,
    restrictions,
    index,
  }: {
    value: string;
    restrictions: ParamRestriction[];
    index: number;
  }) => {
    const validationErrors = validateJsonWithRestrictions(value, restrictions);

    if (validationErrors.length > 0) {
      setCustomErrors((prev) => ({
        ...prev,
        [`messages.${index}`]: {
          types: validationErrors.reduce((acc, current) => {
            acc[current] = current;
            return acc;
          }, {}),
        },
      }));
    } else {
      setCustomErrors((prev) => ({ ...prev, [`messages.${index}`]: {} }));
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

            const fieldRef = register(`messages.${i}`, {});

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
                    onChange={(e) => {
                      handleValidateJson({
                        value: e.target.value,
                        restrictions: func.param_restrictions,
                        index: i,
                      });
                      setValue(`messages.${i}`, e.target.value);
                    }}
                    ref={fieldRef.ref}
                    name={fieldRef.name}
                    size="sm"
                    rows={textAreaSize}
                    isDisabled={!isAuthorized}
                  />
                  <div>
                    {Object.keys(
                      customErrors?.[`messages.${i}`]?.types || {},
                    ).map((e, i) => (
                      <InfoText
                        key={`field error ${i}`}
                        variant={"error"}
                        className="mt-2"
                      >
                        {e}
                      </InfoText>
                    ))}
                  </div>
                </FormField>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    resetField(`messages.${i}`);
                    setCustomErrors((prev) => ({
                      ...prev,
                      [`messages.${i}`]: {},
                    }));
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

interface CustomErrorTypes {
  [key: string]: string;
}

interface CustomErrors {
  [key: string]: {
    types?: CustomErrorTypes;
  };
}
