"use client";
import { Section, Story, TabButton } from "~/components";
import {
  TabsRoot,
  TabsList,
  TabsContent,
  TextInput,
  TableCell,
  TableWriteable,
} from "@valence-ui/ui-components";
import { Fragment, useState } from "react";

const TablesWriteable = () => {
  const [activeTab, setActiveTab] = useState(DisplayState.Data);
  const isLoading = activeTab === DisplayState.Loading;

  const tableRows = inputTableData.map((lineItem) => {
    return (
      <Fragment key={`t1${lineItem.denom}`}>
        <TableCell isLoading={isLoading} variant="input">
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
            <TableWriteable
              headers={[
                {
                  label: "Available funds",
                },
                {
                  label: "Deposit Amount",
                },
              ]}
            >
              {tableRows}
            </TableWriteable>
          </Story>
        </TabsContent>
        <TabsContent
          className="flex flex-col gap-8"
          value={DisplayState.Loading}
        >
          <Story>
            <TableWriteable
              headers={[
                {
                  label: "Available funds",
                },
                {
                  label: "Deposit Amount",
                },
              ]}
            >
              {tableRows}
            </TableWriteable>
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
