"use client";
import { Section, Story, TabButton } from "~/components";
import {
  TabsRoot,
  TabsList,
  TabsContent,
  TextInput,
  TableCell,
  TableForm,
  InfoText,
} from "@valence-ui/ui-components";
import { Fragment, useState } from "react";

/***
 * TODO: tooltip
 */

const TablesWriteable = () => {
  const [activeTab, setActiveTab] = useState(DisplayState.Data);
  const isLoading = activeTab === DisplayState.Loading;

  const headers = [
    {
      label: "Available funds",
    },
    {
      label: "Deposit Amount",
    },
  ];

  const tableRows = inputTableData.map((lineItem) => {
    return (
      <Fragment key={`tableform-${lineItem.denom}`}>
        <TableCell align="left" isLoading={isLoading} variant="input">
          {lineItem.amount} {lineItem.symbol ?? ""}
        </TableCell>
        <TableCell isLoading={isLoading} variant="input">
          <TextInput
            className="w-full"
            size="sm"
            type="number"
            suffix={lineItem.symbol}
          />
        </TableCell>
      </Fragment>
    );
  });

  return (
    <Section id="writeable-table">
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
            <TableForm
              messages={[<InfoText variant="info">Here is some info</InfoText>]}
              headers={headers}
            >
              {tableRows}
            </TableForm>
          </Story>
        </TabsContent>
        <TabsContent
          className="flex flex-col gap-8"
          value={DisplayState.Loading}
        >
          <Story>
            <TableForm
              messages={[<InfoText variant="info">Here is some info</InfoText>]}
              headers={headers}
            >
              {tableRows}
            </TableForm>
          </Story>
        </TabsContent>
        <TabsContent className="flex flex-col gap-8" value={DisplayState.Error}>
          <Story>
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
          </Story>
        </TabsContent>
      </TabsRoot>
    </Section>
  );
};

export default TablesWriteable;

enum DisplayState {
  Data = "data",
  Loading = "loading",
  Error = "error",
}

const inputTableData = [
  {
    amount: "1000.00",
    denom: "USDC",
    symbol: "USDC",
  },
  {
    amount: "1000.00",
    denom: "ETH",
    symbol: "ETH",
  },
  {
    amount: "1000.00",
    denom: "BTC",
    symbol: "BTC",
  },
];
