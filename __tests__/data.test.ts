import { featuredStocks, getFeatured, sampleQuotes } from "@/data";

describe("featured market data", () => {
  it("keeps the curated symbols covered by sample quotes", () => {
    expect(featuredStocks).toHaveLength(8);
    expect(featuredStocks.every(({ symbol }) => sampleQuotes[symbol])).toBe(
      true,
    );
  });

  it("looks up symbols case-sensitively for route data", () => {
    expect(getFeatured("AAPL")?.name).toBe("Apple Inc.");
    expect(getFeatured("UNKNOWN")).toBeUndefined();
  });
});
