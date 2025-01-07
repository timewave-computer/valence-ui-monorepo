import { Section, Story } from "~/components";
import {
  IconTooltipContent,
  TableHeader,
  TableRoot,
} from "@valence-ui/ui-components";

const headers: TableHeader[] = [
  {
    key: "asset",
    label: "Asset",
    cellType: "asset",
    hoverTooltip: (
      <IconTooltipContent title="Tooltip title" text="Sample tooltip text." />
    ),
  },
  {
    key: "price",
    label: "Price",
    cellType: "number",
  },
  {
    key: "address",
    cellType: "text",
    label: "Address",
  },
];

const data = [
  {
    asset: {
      symbol: "BTC",
      color: "yellow",
    },
    price: {
      value: "0.00",
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      href: "https://google.com",
    },
  },
  {
    asset: {
      symbol: "ETH",
      color: "blue",
    },
    price: {
      value: "0.00",
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      href: "https://google.com",
    },
  },
  {
    asset: {
      symbol: "LTC",
      color: "silver",
    },

    // number & text have same interface (?),
    price: {
      value: "0.00",
    },
    address: {
      value: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      href: "https://google.com",
    },
  },
];

//todo: handle default view
//todo: handle loading
const Tables = () => {
  return (
    <Section id="table">
      <>
        <Story>
          <TableRoot tableId="table1" headers={headers} data={data}></TableRoot>
        </Story>
        <Story>
          <TableRoot
            variant="secondary"
            tableId="table2"
            headers={headers}
            data={data}
          ></TableRoot>
        </Story>
      </>
    </Section>
  );
};

export default Tables;
