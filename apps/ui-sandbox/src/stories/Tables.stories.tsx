import { Section, Story } from "~/components";
import {
  IconTooltipContent,
  Table,
  type TableRow,
  CellType,
  type TableColumnHeader,
} from "@valence-ui/ui-components";

const headers: TableColumnHeader[] = [
  {
    key: "asset",
    label: "Asset",
    cellType: CellType.Asset,
    hoverTooltip: (
      <IconTooltipContent title="Tooltip title" text="Sample tooltip text." />
    ),
    align: "left",
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
    align: "center",
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

const Tables = () => {
  return (
    <Section id="table" className="flex flex-col gap-12">
      <Story label="primary">
        <Table headers={headers} data={data} />
      </Story>
      <Story label="secondary">
        <Table variant="secondary" headers={headers} data={data} />
      </Story>

      <Story label="primary,loading">
        <Table variant="primary" headers={headers} data={data} isLoading />
      </Story>

      <Story label="secondary,loading">
        <Table variant="secondary" headers={headers} data={data} isLoading />
      </Story>

      <Story label="primary,empty">
        <Table headers={headers} data={[]} />
      </Story>

      <Story label="secondary,empty">
        <Table variant="secondary" headers={headers} data={[]} />
      </Story>
    </Section>
  );
};

export default Tables;
