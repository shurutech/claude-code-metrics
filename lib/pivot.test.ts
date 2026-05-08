import { describe, it, expect } from "vitest";
import { pivotPerDev } from "./pivot";

describe("pivotPerDev", () => {
  it("pivots long rows to wide rows keyed on day", () => {
    const long = [
      { day: "2026-05-01", user_email: "a@x.com", total: 10 },
      { day: "2026-05-01", user_email: "b@x.com", total: 20 },
      { day: "2026-05-02", user_email: "a@x.com", total: 5 },
    ];
    const result = pivotPerDev(long);
    expect(result.emails).toEqual(["a@x.com", "b@x.com"]);
    expect(result.rows).toEqual([
      { day: "2026-05-01", "a@x.com": 10, "b@x.com": 20 },
      { day: "2026-05-02", "a@x.com": 5, "b@x.com": 0 },
    ]);
  });

  it("returns empty rows and empty emails for empty input", () => {
    expect(pivotPerDev([])).toEqual({ rows: [], emails: [] });
  });

  it("fills missing user/day combinations with 0", () => {
    const long = [
      { day: "2026-05-01", user_email: "a@x.com", total: 10 },
      { day: "2026-05-02", user_email: "b@x.com", total: 30 },
    ];
    const { rows } = pivotPerDev(long);
    expect(rows).toEqual([
      { day: "2026-05-01", "a@x.com": 10, "b@x.com": 0 },
      { day: "2026-05-02", "a@x.com": 0, "b@x.com": 30 },
    ]);
  });
});
