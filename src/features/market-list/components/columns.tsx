import Decimal from "decimal.js";
import { PriceChange } from "./PriceChange";
import type { ColumnData } from "../../../ui/data-table";
import { Icon } from "../../../ui/icon";
import styles from "../styles.module.css";

export const columns: ColumnData[] = [
  {
    label: "Asset",
    dataKey: "market",
    cellRenderer: ({ cellData }) => (
      <div className={styles.marketName}>
        <Icon
          className={styles.marketIcon}
          currency={cellData.match(/^(.+?)-/)?.[1].toLowerCase()}
        />
        <span>{cellData}</span>
      </div>
    ),
  },
  {
    label: "Price",
    dataKey: "last",
  },
  {
    label: "Change (24h)",
    dataKey: "change",
    cellRenderer: ({ cellData }) => <PriceChange change={cellData} />,
  },
  {
    label: "Volume",
    dataKey: "volumeQuote",
    cellRenderer: ({ cellData }) =>
      cellData &&
      new Decimal(cellData).toDecimalPlaces(2).toNumber().toLocaleString(),
  },
];
