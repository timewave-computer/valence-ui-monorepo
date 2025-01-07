import { Section, Story } from "~/components";
import {
  IconTooltipContent,
  TableHeader,
  Table,
  TableRow,
  Cells,
} from "@valence-ui/ui-components";

// saving these
// const isExternalLink = href.startsWith("http");, set link comp
// getting symbol color in rebalancer ui

const headers: TableHeader[] = [
  {
    key: "asset",
    label: "Asset",
    cellType: Cells.Asset,
    hoverTooltip: (
      <IconTooltipContent title="Tooltip title" text="Sample tooltip text." />
    ),
    align: "left",
  },
  {
    key: "price",
    label: "Price",
    cellType: Cells.Number,
    align: "right",
  },
  {
    key: "address",
    cellType: Cells.Text,
    label: "Address",
    align: "center",
  },
  {
    key: "status",
    cellType: Cells.Label,
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
      value: "0.00",
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      href: "https://google.com",
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
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      href: "https://google.com",
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
      value: "0.00",
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      href: "https://google.com",
    },
    status: {
      value: "inactive",
      color: "gray",
    },
  },
];

const Tables = () => {
  return (
    <Section id="table" className="flex flex-col gap-10">
      <Story>
        <Table tableId="table1" headers={headers} data={data} />
      </Story>
      <Story>
        <Table
          variant="secondary"
          tableId="table2"
          headers={headers}
          data={data}
        />
      </Story>
    </Section>
  );
};

export default Tables;
