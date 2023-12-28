import { render } from "@testing-library/react";
import { PriceChange } from "./PriceChange"; // Replace with the actual path
import { formatPercentage } from "../utils/calculateChange";
import styles from "../styles.module.css";

jest.mock("../utils/calculateChange", () => ({
  formatPercentage: jest.fn(),
}));

describe("PriceChange Component", () => {
  it("displays positive change correctly", () => {
    formatPercentage.mockReturnValue("+5");
    const { getByText } = render(<PriceChange change={5} />);

    expect(getByText("+5 %")).toBeInTheDocument();
    expect(getByText("+5 %")).toHaveClass(
      "price-change",
      styles.priceChangePositive
    );
  });

  it("displays negative change correctly", () => {
    formatPercentage.mockReturnValue("-3");
    const { getByText } = render(<PriceChange change={-3} />);

    expect(getByText("-3 %")).toBeInTheDocument();
    expect(getByText("-3 %")).toHaveClass(
      "price-change",
      styles.priceChangeNegative
    );
  });

  it("displays zero change correctly", () => {
    formatPercentage.mockReturnValue("0");
    const { getByText } = render(<PriceChange change={0} />);

    expect(getByText("0 %")).toBeInTheDocument();
    expect(getByText("0 %")).toHaveClass("price-change");
  });
});
