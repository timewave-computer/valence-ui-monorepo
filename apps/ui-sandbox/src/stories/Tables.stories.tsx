import { Section, Story } from "~/components";
import { TableRoot } from "@valence-ui/ui-components";

const headers = [
  {
    key: "asset",
    label: "Asset",
    cellType: "asset",
    sortable: true,
  },
  {
    key: "price",
    label: "Price",
    cellType: "number", // sorter (a, b, ascending) => compareNumbers(a.amount, b.amount, ascending),
    sortable: true,
  },
  {
    key: "address",
    cellType: "text", //sort: (a, b, ascending) => compareStrings(a.symbol, b.symbol, ascending),
    label: "Address",
    sortable: false,
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
          <TableRoot
            tableId="section1"
            headers={headers}
            data={data}
          ></TableRoot>
        </Story>
      </>
    </Section>
  );
};

export default Tables;
