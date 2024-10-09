const COLORS = {
  primary: "#117500",
  secondary: "#242526",
  black: "#07080a",
  gray: "#494948",
  white: "#FFFFFF",
  green: "#009940",
  red: "#FF0000",
};

const buttonTypes = [
  { name: "Favorite" },
  { name: "Index" },
  { name: "Gainers" },
  { name: "Losers" },
  { name: "Market Cap" },
];

const dummyStocks = [
  { id: 1, name: "Apple", price: 100, change: -24 },
  { id: 2, name: "Google", price: 200, change: -25 },
  { id: 3, name: "Facebook", price: 150, change: 24 },
  { id: 4, name: "Amazon", price: 350, change: 30 },
  { id: 5, name: "Microsoft", price: 280, change: -15 },
  { id: 6, name: "Tesla", price: 500, change: 45 },
  { id: 7, name: "Netflix", price: 220, change: -10 },
  { id: 8, name: "Nvidia", price: 450, change: 55 },
  { id: 9, name: "Intel", price: 100, change: 5 },
  { id: 10, name: "Adobe", price: 300, change: -20 },
];

export { COLORS, dummyStocks, buttonTypes };
