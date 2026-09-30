export type Stock = { symbol: string; name: string; category: "Stock" | "ETF" };
export type Quote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  previousClose: number;
  timestamp: number;
};
export type Profile = {
  name: string;
  exchange: string;
  industry: string;
  country: string;
  currency: string;
  marketCap: number;
  website: string;
};

export const featuredStocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", category: "Stock" },
  { symbol: "MSFT", name: "Microsoft Corp.", category: "Stock" },
  { symbol: "NVDA", name: "NVIDIA Corp.", category: "Stock" },
  { symbol: "GOOGL", name: "Alphabet Inc.", category: "Stock" },
  { symbol: "AMZN", name: "Amazon.com Inc.", category: "Stock" },
  { symbol: "TSLA", name: "Tesla Inc.", category: "Stock" },
  { symbol: "SPY", name: "SPDR S&P 500 ETF", category: "ETF" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", category: "ETF" },
];

// These fixed values are examples for exploring the app with no API key.
// Never present them as current market prices.
export const sampleQuotes: Record<string, Quote> = {
  AAPL: {
    symbol: "AAPL",
    price: 185.42,
    change: 2.13,
    changePercent: 1.16,
    high: 186.8,
    low: 182.9,
    previousClose: 183.29,
    timestamp: 0,
  },
  MSFT: {
    symbol: "MSFT",
    price: 412.35,
    change: 3.55,
    changePercent: 0.87,
    high: 414.1,
    low: 407.8,
    previousClose: 408.8,
    timestamp: 0,
  },
  NVDA: {
    symbol: "NVDA",
    price: 128.6,
    change: -1.4,
    changePercent: -1.08,
    high: 131.2,
    low: 127.5,
    previousClose: 130,
    timestamp: 0,
  },
  GOOGL: {
    symbol: "GOOGL",
    price: 174.22,
    change: 0.92,
    changePercent: 0.53,
    high: 175.6,
    low: 171.9,
    previousClose: 173.3,
    timestamp: 0,
  },
  AMZN: {
    symbol: "AMZN",
    price: 186.1,
    change: -0.86,
    changePercent: -0.46,
    high: 188.2,
    low: 184.9,
    previousClose: 186.96,
    timestamp: 0,
  },
  TSLA: {
    symbol: "TSLA",
    price: 242.8,
    change: 4.25,
    changePercent: 1.78,
    high: 244.2,
    low: 237.1,
    previousClose: 238.55,
    timestamp: 0,
  },
  SPY: {
    symbol: "SPY",
    price: 542.15,
    change: 1.45,
    changePercent: 0.27,
    high: 543.6,
    low: 539.9,
    previousClose: 540.7,
    timestamp: 0,
  },
  QQQ: {
    symbol: "QQQ",
    price: 462.34,
    change: -0.75,
    changePercent: -0.16,
    high: 464.9,
    low: 460.6,
    previousClose: 463.09,
    timestamp: 0,
  },
};

export const getFeatured = (symbol: string): Stock | undefined =>
  featuredStocks.find((stock) => stock.symbol === symbol);
