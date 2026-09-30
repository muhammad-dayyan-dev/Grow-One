import type { Profile, Quote, Stock } from "../data";

const BASE_URL = "https://finnhub.io/api/v1";
const apiKey = process.env.EXPO_PUBLIC_FINNHUB_API_KEY?.trim();

export const hasApiKey = Boolean(apiKey && apiKey !== "your_free_finnhub_key");

async function get<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  if (!hasApiKey) throw new Error("Add a Finnhub API key to load market data.");
  const query = new URLSearchParams({ ...params, token: apiKey! });
  const response = await fetch(`${BASE_URL}${path}?${query}`);
  if (response.status === 429)
    throw new Error("Finnhub rate limit reached. Try again in a minute.");
  if (response.status === 401 || response.status === 403)
    throw new Error("Finnhub rejected the API key. Check your .env file.");
  if (!response.ok)
    throw new Error(`Market data request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

type ApiQuote = {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  pc: number;
  t: number;
};

export async function fetchQuote(symbol: string): Promise<Quote> {
  const data = await get<ApiQuote>("/quote", { symbol });
  if (!Number.isFinite(data.c) || data.c <= 0 || !data.t) {
    throw new Error(`No quote is available for ${symbol}.`);
  }
  return {
    symbol,
    price: data.c,
    change: data.d,
    changePercent: data.dp,
    high: data.h,
    low: data.l,
    previousClose: data.pc,
    timestamp: data.t,
  };
}

type ApiProfile = {
  name?: string;
  exchange?: string;
  finnhubIndustry?: string;
  country?: string;
  currency?: string;
  marketCapitalization?: number;
  weburl?: string;
};

export async function fetchProfile(symbol: string): Promise<Profile> {
  const data = await get<ApiProfile>("/stock/profile2", { symbol });
  return {
    name: data.name || symbol,
    exchange: data.exchange || "—",
    industry: data.finnhubIndustry || "—",
    country: data.country || "—",
    currency: data.currency || "USD",
    marketCap: data.marketCapitalization || 0,
    website: data.weburl || "",
  };
}

type ApiSearch = {
  result?: { symbol: string; description: string; type?: string }[];
};

export async function searchSymbols(query: string): Promise<Stock[]> {
  const data = await get<ApiSearch>("/search", { q: query });
  return (data.result || [])
    .filter(
      (result) =>
        /^[A-Z][A-Z0-9.:-]{0,19}$/.test(result.symbol) &&
        result.description &&
        result.type &&
        /stock|etf/i.test(result.type),
    )
    .slice(0, 25)
    .map((result) => ({
      symbol: result.symbol,
      name: result.description,
      category: result.type?.toUpperCase().includes("ETF") ? "ETF" : "Stock",
    }));
}
