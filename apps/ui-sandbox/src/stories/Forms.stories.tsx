"use client";
import { Section, Story, StoryLabel, TabButton } from "~/components";
import {
  FormControl,
  FormField,
  InputLabel,
  FormRoot,
  TextInput,
  FormSubmit,
  Button,
  TableForm,
  TabsContent,
  TabsList,
  InfoText,
  TabsRoot,
  TableCell,
  Toaster,
  ToastMessage,
  toast,
  PrettyJson,
} from "@valence-ui/ui-components";
import { useFieldArray, useForm } from "react-hook-form";
import { Fragment, useState } from "react";

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
      <Toaster />
      <StoryLabel className="text-xs">form</StoryLabel>
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
      <TablesWriteable />
    </Section>
  );
};

export default Forms;

type WithdrawFormValues = {
  amounts: Array<{
    amount: string;
    symbol: string;
    denom: string;
  }>;
};
const TablesWriteable = () => {
  const [activeTab, setActiveTab] = useState(DisplayState.Data);
  const isLoading = activeTab === DisplayState.Loading;

  const { register, control, handleSubmit } = useForm<WithdrawFormValues>({
    defaultValues: {
      amounts: [
        {
          amount: "10",
          symbol: "USDC",
          denom:
            "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
        },
        {
          amount: "10",
          symbol: "ETH",
          denom:
            "ibc/B559A80D62249C8AA07A380E2A2BEA6E5CA9A6F079C912C3A9E9B494105E4F81",
        },
        {
          amount: "10",
          symbol: "NTRN",
          denom: "untrn",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "amounts",
  });

  const handleSubmitForm = (values: WithdrawFormValues) => {
    toast.success(
      <ToastMessage variant="success" title="Form submitted">
        <PrettyJson data={values} />
      </ToastMessage>
    );
  };

  const headers = [
    {
      label: "Available funds",
    },
    {
      label: "Deposit Amount",
    },
  ];

  const tableRows = fields.map((lineItem, i) => {
    return (
      <Fragment key={`tableform-${lineItem.denom}`}>
        <TableCell align="left" isLoading={isLoading} variant="input">
          {lineItem.amount} {lineItem.symbol ?? ""}
        </TableCell>
        <TableCell isLoading={isLoading} variant="input">
          <FormField asChild name={`${i}.amount`}>
            <FormControl asChild>
              <TextInput
                {...register(`amounts.${i}.amount`)}
                className="w-full"
                size="sm"
                type="number"
                suffix={lineItem.symbol}
              />
            </FormControl>
          </FormField>
        </TableCell>
      </Fragment>
    );
  });

  return (
    <Section className="pt-10" id="writeable-table">
      <StoryLabel className="text-xs">table</StoryLabel>
      <TabsRoot
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as DisplayState)}
      >
        <TabsList className="flex flex-row gap-2 py-2">
          {Object.values(DisplayState).map((state) => (
            <TabButton
              key={`tab-button-${state}`}
              onClick={() => setActiveTab(state)}
              isActive={activeTab === state}
              state={state}
            />
          ))}
        </TabsList>
        <TabsContent className="flex flex-col gap-8" value={DisplayState.Data}>
          <Story>
            <FormRoot onSubmit={handleSubmit(handleSubmitForm)}>
              <TableForm
                messages={[
                  <InfoText variant="info">Here is some info</InfoText>,
                ]}
                headers={headers}
              >
                {tableRows}
              </TableForm>
              <FormSubmit className="mt-3" asChild>
                <Button>Submit</Button>
              </FormSubmit>
            </FormRoot>
          </Story>
        </TabsContent>
        <TabsContent
          className="flex flex-col gap-8"
          value={DisplayState.Loading}
        >
          <Story>
            <FormRoot onSubmit={handleSubmit(handleSubmitForm)}>
              <TableForm
                messages={[
                  <InfoText variant="info">Here is some info</InfoText>,
                ]}
                headers={headers}
              >
                {tableRows}
              </TableForm>
              <FormSubmit asChild>
                <Button className="mt-3">Submit</Button>
              </FormSubmit>
            </FormRoot>
          </Story>
        </TabsContent>
        <TabsContent className="flex flex-col gap-8" value={DisplayState.Error}>
          <Story>
            <FormRoot onSubmit={handleSubmit(handleSubmitForm)}>
              <TableForm
                messages={[
                  <InfoText variant="info">Here is some info</InfoText>,
                  <InfoText variant="warn">
                    Insufficient funds in wallet
                  </InfoText>,
                  <InfoText variant="error">
                    {" "}
                    Value cannot be less than 1.00
                  </InfoText>,
                ]}
                headers={headers}
              >
                {tableRows}
              </TableForm>
              <FormSubmit asChild>
                <Button className="mt-3">Submit</Button>
              </FormSubmit>
            </FormRoot>
          </Story>
        </TabsContent>
      </TabsRoot>
    </Section>
  );
};

enum DisplayState {
  Data = "data",
  Loading = "loading",
  Error = "error",
}
