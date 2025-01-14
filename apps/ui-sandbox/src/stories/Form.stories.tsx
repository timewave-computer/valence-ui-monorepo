"use client";
import { Section, Story } from "~/components";
import {
  FormControl,
  FormField,
  InputLabel,
  FormRoot,
  TextInput,
  FormSubmit,
  Button,
  Toaster,
  ToastMessage,
  toast,
  PrettyJson,
} from "@valence-ui/ui-components";
import { useForm } from "react-hook-form";

type PersonFormValues = {
  name: string;
  email?: string;
  amount: string;
};
const Forms = () => {
  const { register, handleSubmit } = useForm<PersonFormValues>({
    defaultValues: {
      name: "Ted",
      email: "lasso@diamonddog.com",
      amount: "10",
    },
  });

  const handleSubmitForm = (values: PersonFormValues) => {
    toast.success(
      <ToastMessage variant="success" title="Form submitted">
        <PrettyJson data={values} />
      </ToastMessage>
    );
  };

  return (
    <Section className="">
      <Story className="px-4">
        <FormRoot
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col gap-6 pt-4"
        >
          <FormField name="name">
            <InputLabel label="Name" />
            <FormControl asChild>
              <TextInput {...register("name")} placeholder="Soulja boy" />
            </FormControl>
          </FormField>

          <FormField name="email">
            <InputLabel label="Email" />
            <FormControl asChild>
              <TextInput {...register("email")} placeholder="me@me.com" />
            </FormControl>
          </FormField>

          <FormField name="amount">
            <InputLabel label="Amount" />
            <FormControl asChild>
              <TextInput
                type="number"
                {...register("amount")}
                placeholder="0.00"
              />
            </FormControl>
          </FormField>
          <FormSubmit asChild>
            <Button>Submit</Button>
          </FormSubmit>
        </FormRoot>
      </Story>
    </Section>
  );
};

export default Forms;
