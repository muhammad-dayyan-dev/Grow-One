import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchQuote, hasApiKey } from "../api/finnhub";
import { featuredStocks, sampleQuotes, type Quote, type Stock } from "../data";

const STORAGE_KEY = "@grow-one/watchlist-v2";
const initialWatchlist = featuredStocks.slice(0, 3);

type MarketContextValue = {
  quotes: Record<string, Quote>;
  watchlist: Stock[];
  watchlistReady: boolean;
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  demo: boolean;
  refresh: (symbols?: string[]) => Promise<void>;
  toggleWatchlist: (stock: Stock) => void;
  isSaved: (symbol: string) => boolean;
};

const MarketContext = createContext<MarketContextValue | null>(null);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Record<string, Quote>>(
    hasApiKey ? {} : sampleQuotes,
  );
  const [watchlist, setWatchlist] = useState<Stock[]>(initialWatchlist);
  const [watchlistReady, setWatchlistReady] = useState(false);
  const [loading, setLoading] = useState(hasApiKey);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!saved) return;
        const value: unknown = JSON.parse(saved);
        if (Array.isArray(value)) {
          setWatchlist(
            value.filter(
              (item): item is Stock =>
                typeof item === "object" &&
                item !== null &&
                typeof item.symbol === "string" &&
                typeof item.name === "string" &&
                (item.category === "Stock" || item.category === "ETF"),
            ),
          );
        }
      })
      .catch(() => setError("Your watchlist could not be loaded."))
      .finally(() => setWatchlistReady(true));
  }, []);

  useEffect(() => {
    if (watchlistReady) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist)).catch(() =>
        setError("Your watchlist could not be saved."),
      );
    }
  }, [watchlist, watchlistReady]);

  const refresh = useCallback(
    async (symbols = featuredStocks.map((stock) => stock.symbol)) => {
      if (!hasApiKey) return;
      const unique = [...new Set(symbols)].filter(Boolean);
      if (!unique.length) return;
      setLoading(true);
      setError(null);
      const results = await Promise.allSettled(unique.map(fetchQuote));
      const next: Record<string, Quote> = {};
      const failed: string[] = [];
      results.forEach((result, index) => {
        if (result.status === "fulfilled") next[unique[index]] = result.value;
        else
          failed.push(
            result.reason instanceof Error
              ? result.reason.message
              : "Unknown market data error",
          );
      });
      if (Object.keys(next).length) {
        setQuotes((current) => ({ ...current, ...next }));
        setLastRefresh(new Date());
      }
      if (failed.length) setError(failed[0]);
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggleWatchlist = useCallback((stock: Stock) => {
    setWatchlist((current) =>
      current.some((item) => item.symbol === stock.symbol)
        ? current.filter((item) => item.symbol !== stock.symbol)
        : [...current, stock],
    );
  }, []);

  const isSaved = useCallback(
    (symbol: string) => watchlist.some((item) => item.symbol === symbol),
    [watchlist],
  );

  return (
    <MarketContext.Provider
      value={{
        quotes,
        watchlist,
        watchlistReady,
        loading,
        error,
        lastRefresh,
        demo: !hasApiKey,
        refresh,
        toggleWatchlist,
        isSaved,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) throw new Error("useMarket must be used inside MarketProvider");
  return context;
}
