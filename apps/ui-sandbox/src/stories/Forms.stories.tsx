"use client";
import { Section, Story } from "~/components";
import {
  FormControl,
  FormField,
  InputLabel,
  FormRoot,
  TextInput,
} from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";

type PersonFormValues = {
  name: string;
  email?: string;
  amount: number;
};
const Forms = () => {
  const { register, getValues } = useForm<PersonFormValues>({
    defaultValues: {
      name: "Ted",
      email: "lasso@diamonddog.com",
      amount: undefined,
    },
  });

  const handleSubmitForm = () => {
    console.log("submit form");
  };

  // TODO: form errors
  return (
    <Section className="">
      <p>todo: form with button and table</p>
      <Story>
        <FormRoot
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitForm();
          }}
          className="flex flex-col gap-6 pt-4"
        >
          <FormField name="name">
            <InputLabel label="hi" />
            <FormControl asChild>
              <TextInput {...register("name")} placeholder="neutron12345..." />
            </FormControl>
          </FormField>
        </FormRoot>
      </Story>
    </Section>
  );
};

export default Forms;
