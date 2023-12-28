import { render, screen, fireEvent } from "@testing-library/react";
import { MarketList } from "./MarketList";

describe("MarketList", () => {
  it("renders correctly with initial state", () => {
    render(<MarketList />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(screen.getByText("Market List")).toBeInTheDocument();
  });

  it("updates search state on input change", () => {
    render(<MarketList />);
    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "bitcoin" } });
    expect(searchInput.value).toBe("bitcoin");
  });
});
