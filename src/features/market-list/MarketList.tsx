import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { MarketWebSocketManager } from "../../utils/market-websocket-manager";
import { Ticker24hUpdate, Ticker24hUpdateExtended } from "../../utils/types";
import { DataTable } from "../../ui/data-table/DataTable";
import { columns } from "./components/columns";
import { markets } from "../../utils/markets";
import { useWindowFocusBlur } from "../../utils/use-window-focus-blur";
import { calculateChange } from "./utils/calculateChange";

import styles from "./styles.module.css";

type SORT_BY = "market" | "last" | "change" | "volumeQuote";

export const MarketList = () => {
  const [data, setData] = useState<Map<string, Ticker24hUpdateExtended>>(
    new Map()
  );

  const [sortBy, setSortBy] = useState<SORT_BY | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  const [search, setSearch] = useState<string>("");

  const tableData = useMemo(() => Array.from(data.values()), [data]);

  const handleSubscribeEvent = (subscriptions: string[]) => {
    setData((prevData) => {
      const newData = new Map(prevData);
      subscriptions.forEach((item: string) => {
        newData.set(item, { ...prevData.get(item)!, market: item });
      });
      return newData;
    });
    toast.success("Connected");
  };

  const handleTickerEvent = (data: Ticker24hUpdate[]) => {
    setData((prevData) => {
      const newData = new Map(prevData);
      data.forEach((item) => {
        newData.set(item.market, { ...item, change: calculateChange(item) });
      });
      return newData;
    });
  };

  const marketWebSocketManager = useMemo(() => {
    return new MarketWebSocketManager({
      onSubscribe: handleSubscribeEvent,
      onTicker: handleTickerEvent,
    });
  }, []);

  useEffect(() => {
    async function subscribe() {
      await marketWebSocketManager.connect();
      marketWebSocketManager.subscribe(markets);
    }

    subscribe();
  }, [marketWebSocketManager, markets]);

  useWindowFocusBlur({
    onFocus: async () => {
      await marketWebSocketManager.connect();
      marketWebSocketManager.subscribe(markets);
    },
    onBlur: () => {
      marketWebSocketManager.close();
    },
  });

  const handleHeaderClick = useCallback(
    (dataKey: SORT_BY) => {
      if (dataKey === sortBy) {
        setSortDirection((prevDirection) =>
          prevDirection === "ASC" ? "DESC" : "ASC"
        );
      } else {
        setSortBy(dataKey);
        setSortDirection("DESC");
      }
    },
    [sortBy]
  );

  const sortedFilteredData = useMemo(() => {
    let result = tableData;
    if (search) {
      result = result.filter((item) => {
        return item.market.toLowerCase().includes(search.toLowerCase());
      });
    }

    if (sortBy) {
      result = result.toSorted((a, b) => {
        let _a = a[sortBy] || 0;
        let _b = b[sortBy] || 0;

        // Check if the values are numbers and parse them if they are
        if (
          !isNaN(parseFloat(_a as string)) &&
          !isNaN(parseFloat(_b as string))
        ) {
          _a = parseFloat(_a as string);
          _b = parseFloat(_b as string);
        }

        if (_a === _b) {
          return 0;
        }
        if (sortDirection === "ASC") {
          return _a > _b ? 1 : -1;
        }
        return _a > _b ? -1 : 1;
      });
    }

    return result;
  }, [tableData, sortBy, sortDirection, search]);

  return (
    <div className={styles.marketListPage}>
      <div>
        <h2>Market List</h2>
        <input
          type="text"
          className={styles.marketListSearch}
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className={styles.tableContainer}>
        <DataTable
          data={sortedFilteredData}
          columns={columns}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onHeaderClick={({ dataKey }) => handleHeaderClick(dataKey as SORT_BY)}
        />
      </div>
    </div>
  );
};
