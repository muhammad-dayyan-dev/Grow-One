describe("Finnhub client", () => {
  const originalKey = process.env.EXPO_PUBLIC_FINNHUB_API_KEY;

  afterEach(() => {
    jest.resetModules();
    if (originalKey === undefined)
      delete process.env.EXPO_PUBLIC_FINNHUB_API_KEY;
    else process.env.EXPO_PUBLIC_FINNHUB_API_KEY = originalKey;
    jest.restoreAllMocks();
  });

  it("explains that a key is required in sample mode", async () => {
    delete process.env.EXPO_PUBLIC_FINNHUB_API_KEY;
    const { fetchQuote } =
      require("@/api/finnhub") as typeof import("@/api/finnhub");

    await expect(fetchQuote("AAPL")).rejects.toThrow("Add a Finnhub API key");
  });

  it("maps a valid quote response into the app model", async () => {
    process.env.EXPO_PUBLIC_FINNHUB_API_KEY = "test-key";
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        c: 185.42,
        d: 2.13,
        dp: 1.16,
        h: 186.8,
        l: 182.9,
        pc: 183.29,
        t: 1_700_000_000,
      }),
    } as Response);
    const { fetchQuote } =
      require("@/api/finnhub") as typeof import("@/api/finnhub");

    await expect(fetchQuote("AAPL")).resolves.toEqual({
      symbol: "AAPL",
      price: 185.42,
      change: 2.13,
      changePercent: 1.16,
      high: 186.8,
      low: 182.9,
      previousClose: 183.29,
      timestamp: 1_700_000_000,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/quote?symbol=AAPL&token=test-key"),
    );
  });

  it("turns provider limits into a readable error", async () => {
    process.env.EXPO_PUBLIC_FINNHUB_API_KEY = "test-key";
    jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({ ok: false, status: 429 } as Response);
    const { fetchQuote } =
      require("@/api/finnhub") as typeof import("@/api/finnhub");

    await expect(fetchQuote("AAPL")).rejects.toThrow("rate limit reached");
  });
});
