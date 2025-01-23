"use client";
import {
  FormField,
  InfoText,
  InputLabel,
  TextAreaInput,
} from "@valence-ui/ui-components";
import {
  countJsonKeys,
  generateMessageBody,
  type SubroutineMessageFormValues,
  validateJsonWithRestrictions,
} from "@/app/programs/ui";
import { type UseFormReturn } from "react-hook-form";
import {
  type AtomicFunction,
  type NonAtomicFunction,
  type ParamRestriction,
} from "@valence-ui/generated-types";
import { useEffect, useState } from "react";

export const FunctionMessageForm = ({
  func,
  isAuthorized,
  fieldName,
  className,
  form,
}: {
  func: NonAtomicFunction | AtomicFunction;
  isAuthorized: boolean;
  fieldName: `messages.${number}`;
  className?: string;
  form: UseFormReturn<SubroutineMessageFormValues>;
}) => {
  const [customErrors, setCustomErrors] = useState<CustomErrors>({});

  const value = form.watch(fieldName);

  useEffect(() => {
    // const { unsubscribe } = form.watch((value) => {
    //   console.log('watched',value)
    // })
    // return () => unsubscribe()

    handleValidateJson({ value, restrictions: [] });
  }, [value]);

  const handleValidateJson = ({
    value,
    restrictions,
  }: {
    value: string;
    restrictions: ParamRestriction[];
  }) => {
    const validationErrors = validateJsonWithRestrictions(value, restrictions);

    if (validationErrors.length > 0) {
      setCustomErrors({
        types: validationErrors.reduce((acc, current) => {
          acc[current] = current;
          return acc;
        }, {}),
      });
    } else {
      setCustomErrors({});
    }
  };

  const messageBody = generateMessageBody(func.message_details);
  const textAreaSize = Math.min(34, countJsonKeys(messageBody) + 4);
  const fieldRef = form.register(fieldName, {});

  return (
    <FormField name={fieldName}>
      <InputLabel label="Message" size="sm" />
      <TextAreaInput
        placeholder="{...}"
        onChange={(e) => {
          handleValidateJson({ value: e.target.value, restrictions: [] });
          form.setValue(fieldName, e.target.value);
        }}
        ref={fieldRef.ref}
        name={fieldRef.name}
        size="sm"
        rows={textAreaSize}
        isDisabled={!isAuthorized}
      />
      <div>
        {Object.keys(customErrors.types || {}).map((e, i) => (
          <InfoText key={`field error ${i}`} variant={"error"} className="mt-2">
            {e}
          </InfoText>
        ))}
      </div>
    </FormField>
  );
};

interface CustomErrors {
  types?: { [key: string]: string };
}
