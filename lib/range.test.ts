import { describe, it, expect } from "vitest";
import { parseRange, rangeToDates } from "./range";

describe("parseRange", () => {
  it("returns the value when it is a valid range", () => {
    expect(parseRange("7d")).toBe("7d");
    expect(parseRange("30d")).toBe("30d");
    expect(parseRange("90d")).toBe("90d");
    expect(parseRange("all")).toBe("all");
  });

  it("returns the default '30d' when input is invalid or missing", () => {
    expect(parseRange(undefined)).toBe("30d");
    expect(parseRange("")).toBe("30d");
    expect(parseRange("forever")).toBe("30d");
    expect(parseRange("1d")).toBe("30d");
  });
});

describe("rangeToDates", () => {
  it("returns YYYY-MM-DD strings for end = today and start = today − N days", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(rangeToDates("7d").end).toBe(today);
    expect(rangeToDates("30d").end).toBe(today);

    const thirtyAgo = new Date();
    thirtyAgo.setUTCDate(thirtyAgo.getUTCDate() - 30);
    expect(rangeToDates("30d").start).toBe(thirtyAgo.toISOString().slice(0, 10));
  });

  it("returns 2000-01-01 as start for 'all'", () => {
    expect(rangeToDates("all").start).toBe("2000-01-01");
  });
});
