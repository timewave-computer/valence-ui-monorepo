"use client";
import { Section, Story } from "~/components";
import {
  FormControl,
  FormField,
  InputLabel,
  FormRoot,
  TextInput,
  type InputLabelProps,
  type TextInputProps,
  FormSubmit,
  Button,
} from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";

type PersonFormValues = {
  name: string;
  email?: string;
  amount: string;
};
const Forms = () => {
  const { register, getValues, watch, handleSubmit } =
    useForm<PersonFormValues>({
      defaultValues: {
        name: "Ted",
        email: "lasso@diamonddog.com",
        amount: undefined,
      },
    });

  const handleSubmitForm = (values: PersonFormValues) => {
    console.log("form submitted:", values);
  };
  // TODO: form errors

  const variants: Array<{
    labelSize: InputLabelProps["size"];
    inputSize: TextInputProps["size"];
  }> = [
    {
      labelSize: "base",
      inputSize: "base",
    },
    //  {
    //   labelSize:'sm',
    //   inputSize:'sm'

    // }
  ];
  return (
    <Section className="">
      <p>todo: form with button and table</p>
      <p>todo: input errors</p>
      <p>todo: toast msg</p>
      <p>todo: small dropdown, test & asset</p>
      <p>
        todo: style input tables further?. need to make input table cell sm lg
        variants
      </p>
      <div className="grid grid-cols-2  divide-x-2 divide-valence-lightgray">
        {variants.map((variant, index) => {
          return (
            <Story
              className="px-4"
              key={`${variant.labelSize}-${variant.inputSize}-${index}`}
            >
              <FormRoot
                onSubmit={handleSubmit(handleSubmitForm)}
                className="flex flex-col gap-6 pt-4"
              >
                <FormField name="name">
                  <InputLabel size={variant.labelSize} label="Name" />
                  <FormControl asChild>
                    <TextInput
                      {...register("name")}
                      size={variant.inputSize}
                      placeholder="Soulja boy"
                    />
                  </FormControl>
                </FormField>

                <FormField name="email">
                  <InputLabel size={variant.labelSize} label="Email" />
                  <FormControl asChild>
                    <TextInput
                      {...register("email")}
                      size={variant.inputSize}
                      placeholder="me@me.com"
                    />
                  </FormControl>
                </FormField>

                <FormField name="amount">
                  <InputLabel size={variant.labelSize} label="Amount" />
                  <FormControl asChild>
                    <TextInput
                      type="number"
                      {...register("amount")}
                      size={variant.inputSize}
                      placeholder="0.00"
                    />
                  </FormControl>
                </FormField>
                <FormSubmit asChild>
                  <Button>Submit</Button>
                </FormSubmit>
              </FormRoot>
            </Story>
          );
        })}
      </div>
    </Section>
  );
};

export default Forms;
