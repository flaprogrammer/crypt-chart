import { Table, AutoSizer, Column } from "react-virtualized";
import type { ColumnProps, TableProps } from "react-virtualized";
import { Optional } from "../../utils/ts-helpers";
import "react-virtualized/styles.css";
import styles from "./styles.module.css";

export type ColumnData = Optional<ColumnProps, "width">;

interface Props<T> {
  data: T[];
  columns: ColumnData[];
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
  onHeaderClick?: TableProps["onHeaderClick"];
}

export const DataTable = <T extends object>({
  data,
  columns,
  sortBy,
  sortDirection,
  onHeaderClick,
}: Props<T>) => {
  return (
    <AutoSizer>
      {({ height, width }) => {
        return (
          <Table
            width={width}
            height={height}
            headerHeight={40}
            rowHeight={30}
            rowCount={data.length}
            rowGetter={({ index }) => data[index]}
            headerClassName={styles.dataTableHeader}
            {...(sortBy && { sortBy })}
            {...(sortDirection && { sortDirection })}
            {...(onHeaderClick && { onHeaderClick })}
          >
            {columns.map((column) => (
              <Column
                key={column.dataKey}
                label={column.label}
                dataKey={column.dataKey}
                width={column.width || 0}
                cellRenderer={column.cellRenderer}
                flexGrow={column.flexGrow || 10}
              />
            ))}
          </Table>
        );
      }}
    </AutoSizer>
  );
};

export { Column };
