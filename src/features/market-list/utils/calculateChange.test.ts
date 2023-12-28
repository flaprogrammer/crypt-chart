import { calculateChange, formatPercentage } from "./calculateChange";

describe("calculateChange", () => {
  it("should calculate the correct change", () => {
    const update = { ask: "10", bid: "8", open: "9" };
    expect(calculateChange(update)).toBeCloseTo((9 - 9) / 9);
  });

  it("should return 0 if ask, bid, or open is null", () => {
    expect(calculateChange({ ask: null, bid: "8", open: "9" })).toBe(0);
    expect(calculateChange({ ask: "10", bid: null, open: "9" })).toBe(0);
    expect(calculateChange({ ask: "10", bid: "8", open: null })).toBe(0);
  });

  it("should handle zero and negative values correctly", () => {
    expect(calculateChange({ ask: "0", bid: "-2", open: "1" })).toBeCloseTo(
      (-1 - 1) / 1
    );
    expect(calculateChange({ ask: "-1", bid: "0", open: "2" })).toBeCloseTo(
      (-0.5 - 2) / 2
    );
  });
});

describe("formatPercentage", () => {
  it("should format positive changes correctly", () => {
    expect(formatPercentage(0.1234)).toBe("+12.34");
  });

  it("should format negative changes correctly", () => {
    expect(formatPercentage(-0.1234)).toBe("-12.34");
  });

  it("should format zero change correctly", () => {
    expect(formatPercentage(0)).toBe("0.00");
  });

  it("should handle small and large numbers correctly", () => {
    expect(formatPercentage(0.00001)).toBe("0.00");
    expect(formatPercentage(123456)).toBe("+12345600.00");
  });
});
