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
} from "@valence-ui/generated-types";
import { useEffect, useState } from "react";

/**
 * This is its own component to simplify custom error handling and reduce # rerender
 */
export const FunctionMessageFormField = ({
  subroutineFunction,
  isAuthorized,
  fieldName,
  form,
}: {
  subroutineFunction: NonAtomicFunction | AtomicFunction;
  isAuthorized: boolean;
  fieldName: `messages.${number}`;
  form: UseFormReturn<SubroutineMessageFormValues>;
}) => {
  const [customErrors, setCustomErrors] = useState<CustomErrors>({});
  const fieldValue = form.watch(fieldName);

  const handleValidateJson = ({ value }: { value: string }) => {
    const validationErrors = validateJsonWithRestrictions(
      value,
      subroutineFunction.message_details.message.params_restrictions ?? [],
    );

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

  useEffect(() => {
    handleValidateJson({ value: fieldValue });
  }, [fieldValue]);

  const messageBody = generateMessageBody(subroutineFunction.message_details);
  const textAreaSize = Math.min(34, countJsonKeys(messageBody) + 4);
  const fieldRef = form.register(fieldName, {});

  return (
    <div className="flex flex-col gap-2">
      <FormField name={fieldName}>
        <InputLabel label="Message" size="sm" />
        <TextAreaInput
          placeholder="{...}"
          onChange={(e) => {
            handleValidateJson({ value: e.target.value });
            form.setValue(fieldName, e.target.value);
          }}
          ref={fieldRef.ref}
          name={fieldRef.name}
          size="sm"
          rows={textAreaSize}
          isDisabled={!isAuthorized}
        />
        <div className="flex flex-col gap-1">
          {Object.keys(customErrors.types || {}).map((e, i) => (
            <InfoText key={`field error ${i}`} variant={"error"}>
              {e}
            </InfoText>
          ))}
        </div>
      </FormField>
    </div>
  );
};

interface CustomErrors {
  types?: { [key: string]: string };
}
