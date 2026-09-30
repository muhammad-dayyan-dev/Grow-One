import { compactMillions, money, signedPercent } from "@/format";

describe("format helpers", () => {
  it("formats prices and signed daily changes", () => {
    expect(money(185.42)).toBe("$185.42");
    expect(signedPercent(1.16)).toBe("+1.16%");
    expect(signedPercent(-1.08)).toBe("-1.08%");
  });

  it("handles missing values without showing misleading numbers", () => {
    expect(money(undefined)).toBe("—");
    expect(signedPercent(Number.NaN)).toBe("—");
    expect(compactMillions(0)).toBe("—");
  });

  it("formats market capitalization in a compact form", () => {
    expect(compactMillions(1_234.5)).toBe("$1.2B");
  });
});
