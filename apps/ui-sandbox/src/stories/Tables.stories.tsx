"use client";
import { Section, Story } from "~/components";
import {
  HoverContent,
  Table,
  type TableRow,
  CellType,
  type TableColumnHeader,
  TabsRoot,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@valence-ui/ui-components";
import { useState } from "react";

const Tables = () => {
  const [activeTab, setActiveTab] = useState(DisplayState.Data);

  return (
    <Section id="table">
      <TabsRoot
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as DisplayState)}
      >
        <TabsList>
          {Object.values(DisplayState).map((state) => (
            <TabsTrigger
              key={`tab-button-${state}`}
              onClick={() => setActiveTab(state)}
              value={state}
            >
              {state}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent className="flex flex-col gap-8" value={DisplayState.Data}>
          <Story>
            <Table headers={headers} data={data} />
          </Story>
          <Story>
            <Table variant="secondary" headers={headers} data={data} />
          </Story>
        </TabsContent>
        <TabsContent
          className="flex flex-col gap-8"
          value={DisplayState.Loading}
        >
          <Story>
            <Table headers={headers} isLoading data={data} />
          </Story>
          <Story>
            <Table
              variant="secondary"
              isLoading
              headers={headers}
              data={data}
            />
          </Story>
        </TabsContent>
        <TabsContent className="flex flex-col gap-8" value={DisplayState.Empty}>
          <Story>
            <Table headers={headers} data={[]} />
          </Story>
          <Story>
            <Table variant="secondary" headers={headers} data={[]} />
          </Story>
        </TabsContent>
      </TabsRoot>
    </Section>
  );
};

export default Tables;

const headers: TableColumnHeader[] = [
  {
    key: "asset",
    label: "Asset",
    cellType: CellType.Asset,
    hoverTooltip: (
      <HoverContent title="Tooltip title" text="Sample tooltip text." />
    ),
  },
  {
    key: "price",
    label: "Price",
    cellType: CellType.Number,
    align: "right",
  },
  {
    key: "address",
    cellType: CellType.Text,
    label: "Address",
  },
  {
    key: "status",
    cellType: CellType.Label,
    label: "Status",
  },
];

const data: TableRow[] = [
  {
    asset: {
      symbol: "BTC",
      color: "#FF2A00", // red
    },
    price: {
      value: "1000.00",
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      link: {
        href: "https://google.com",
      },
    },
    status: {
      value: "active",
      color: "green",
    },
  },
  {
    asset: {
      symbol: "ETH",
      color: "#00A3FF", // blue
    },
    price: {
      value: "0.00",
      isUsd: true,
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      link: {
        href: "https://google.com",
      },
    },
    status: {
      value: "inactive",
      color: "red",
    },
  },
  {
    asset: {
      symbol: "LTC",
      color: "#EA80D1", // pink
    },
    price: {
      value: "4000.00",
      isUsd: true,
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      link: {
        href: "https://google.com",
      },
    },
    status: {
      value: "inactive",
      color: "gray",
    },
  },
];

enum DisplayState {
  Data = "data",
  Loading = "loading",
  Empty = "empty",
}
