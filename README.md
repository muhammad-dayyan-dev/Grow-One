# Grow One

A small stock market companion built with **React Native, Expo Router, and TypeScript**. Explore a curated set of US stocks and ETFs, search for a company, save a local watchlist, and learn what common quote fields mean. Grow One is an information app; it does not place trades.

## What works

- **Explore:** current available quotes for eight featured US stocks and ETFs, with filters for gainers, losers, and ETFs. Gainers and losers are calculated only from the featured list.
- **Search:** symbol and company search through Finnhub when an API key is configured. Without a key, search still works for the featured symbols.
- **Stock details:** latest available price, daily change, day high and low, previous close, plus Finnhub's free company profile when available.
- **Watchlist:** add or remove symbols and keep the list on the device with AsyncStorage.
- **Learn:** short, offline explanations of tickers, price change, ETFs, and market capitalization.
- **Sample mode:** the app runs without an API key using clearly labeled, fixed example prices. These are **not current market data**.

## Getting started

You need a recent Node.js version and [Expo Go](https://expo.dev/go) or a simulator.

```bash
npm install
npm start
```

Scan the QR code with Expo Go, or run `npm run ios`, `npm run android`, or `npm run web`.

To load market data, get a free key from [Finnhub](https://finnhub.io/register), then create a local `.env` file:

```bash
cp .env.example .env
```

Set `EXPO_PUBLIC_FINNHUB_API_KEY` in `.env` and restart Expo. `.env` is ignored by Git. Do not commit a real key.

> **Key visibility:** Expo's `EXPO_PUBLIC_` values are embedded in the client app and are visible to its users. This setup is suitable for a personal learning project. If you release Grow One publicly with a shared key, put requests behind a server you control, with rate limiting and key protection.

## Data and limitations

The app uses Finnhub's quote, symbol search, and free company profile endpoints ([API documentation](https://finnhub.io/docs/api/quote)). API availability and limits depend on your Finnhub account. Grow One fetches featured quotes on launch and on pull to refresh; it does not stream prices. Quote timestamps are shown on the stock detail screen. A missing or rejected quote displays an error or `—` instead of a made-up value.

The featured list is US focused. SPY and QQQ are **ETFs**, not index values. The app does not claim to show market-wide top gainers, portfolio holdings, trading, or financial advice. Market data can be delayed or unavailable, including when the provider rate limit is reached.

## Project structure

```text
app/                    Expo Router screens and tab navigation
src/api/finnhub.ts      API requests and response mapping
src/context/            Quotes, watchlist, and sample mode
src/components/         Reusable stock row and notices
src/data.ts             Featured symbols and fixed example quotes
src/theme.ts            Shared colors and UI tokens
__tests__/               Jest tests for data, formatting, and API behavior
```

## Checks

```bash
npm run check
npm test
npm run test:watch
npm run test:coverage
npx expo export --platform web
```

## How Jest is used here

Grow One uses Expo's `jest-expo` preset, which configures Jest for the React Native and Expo runtime. The tests live outside `app/` because Expo Router treats every file inside that directory as a route.

- `format.test.ts` checks display helpers such as currency, percentages, missing values, and compact market caps.
- `data.test.ts` checks that every featured symbol has sample data and that symbol lookup behaves correctly.
- `finnhub.test.ts` mocks `fetch` so tests never call the real API. It checks sample-mode guidance, Finnhub quote mapping, and readable rate-limit errors.

Run `npm test` before a commit for a one-time run. Use `npm run test:watch` while editing; Jest reruns the affected tests when files change. Use `npm run test:coverage` when you want an HTML report in `coverage/lcov-report/index.html`.

These are unit and API-client tests. They verify the app's data transformations and failure states without needing Expo Go, a simulator, or a Finnhub key. UI end-to-end testing can be added later with a tool such as Maestro if the project grows beyond a portfolio demo.

The original JavaScript prototype was a static, incomplete screen. This rewrite uses TypeScript throughout the app, keeps sample data explicit, and adds working navigation, search, details, filtering, and persistent favorites.
