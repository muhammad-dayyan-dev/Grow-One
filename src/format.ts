export function money(value: number | undefined, currency = "USD") {
  if (value == null || !Number.isFinite(value)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

export function signedPercent(value: number | undefined) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function compactMillions(value: number | undefined) {
  if (value == null || !Number.isFinite(value) || value <= 0) return "—";
  const [amount, suffix] =
    value >= 1_000_000
      ? [value / 1_000_000, "T"]
      : value >= 1_000
        ? [value / 1_000, "B"]
        : value >= 1
          ? [value, "M"]
          : [value * 1_000, "K"];
  return `$${amount.toFixed(1).replace(/\.0$/, "")}${suffix}`;
}

export function quoteTime(unixSeconds: number) {
  if (!unixSeconds) return "Time unavailable";
  return new Date(unixSeconds * 1000).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
