import { useMemo } from "react";
import classNames from "classnames";
import { formatPercentage } from "../utils/calculateChange";
import styles from "../styles.module.css";

type Props = {
  change: number;
};

export const PriceChange = ({ change }: Props) => {
  const formattedChange = formatPercentage(change);

  const className = useMemo(() => {
    if (change > 0) {
      return styles.priceChangePositive;
    }
    if (change < 0) {
      return styles.priceChangeNegative;
    }
    return "";
  }, [change]);

  return (
    <span className={classNames("price-change", className)}>
      {formattedChange} %
    </span>
  );
};
