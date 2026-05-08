import { describe, it, expect } from "vitest";
import {
  parseDateParams,
  presetToDates,
  matchPreset,
  rangeLabel,
} from "./range";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

describe("parseDateParams", () => {
  it("returns the dates when both are valid YYYY-MM-DD", () => {
    expect(parseDateParams({ start: "2026-04-01", end: "2026-05-08" })).toEqual({
      start: "2026-04-01",
      end: "2026-05-08",
    });
  });

  it("defaults to last 30 days when params are missing", () => {
    expect(parseDateParams({})).toEqual({
      start: daysAgoISO(30),
      end: todayISO(),
    });
  });

  it("defaults to last 30 days when format is invalid", () => {
    expect(parseDateParams({ start: "yesterday", end: "today" })).toEqual({
      start: daysAgoISO(30),
      end: todayISO(),
    });
  });

  it("defaults when only one of start/end is given", () => {
    expect(parseDateParams({ start: "2026-04-01" })).toEqual({
      start: daysAgoISO(30),
      end: todayISO(),
    });
    expect(parseDateParams({ end: "2026-05-08" })).toEqual({
      start: daysAgoISO(30),
      end: todayISO(),
    });
  });

  it("swaps when start is after end", () => {
    expect(parseDateParams({ start: "2026-05-08", end: "2026-04-01" })).toEqual({
      start: "2026-04-01",
      end: "2026-05-08",
    });
  });

  it("rejects malformed YYYY-MM-DD strings", () => {
    expect(parseDateParams({ start: "2026/04/01", end: "2026-05-08" })).toEqual({
      start: daysAgoISO(30),
      end: todayISO(),
    });
    expect(parseDateParams({ start: "2026-13-01", end: "2026-05-08" })).toEqual({
      start: daysAgoISO(30),
      end: todayISO(),
    });
  });
});

describe("presetToDates", () => {
  it("computes 2d as today minus 2 → today", () => {
    expect(presetToDates("2d")).toEqual({
      start: daysAgoISO(2),
      end: todayISO(),
    });
  });

  it("computes 7d as today minus 7 → today", () => {
    expect(presetToDates("7d")).toEqual({
      start: daysAgoISO(7),
      end: todayISO(),
    });
  });

  it("computes 30d as today minus 30 → today", () => {
    expect(presetToDates("30d")).toEqual({
      start: daysAgoISO(30),
      end: todayISO(),
    });
  });

  it("uses 2000-01-01 sentinel for 'all'", () => {
    expect(presetToDates("all")).toEqual({
      start: "2000-01-01",
      end: todayISO(),
    });
  });
});

describe("matchPreset", () => {
  it("matches when start/end equal a preset's computed dates", () => {
    expect(matchPreset(daysAgoISO(2), todayISO())).toBe("2d");
    expect(matchPreset(daysAgoISO(7), todayISO())).toBe("7d");
    expect(matchPreset(daysAgoISO(30), todayISO())).toBe("30d");
    expect(matchPreset("2000-01-01", todayISO())).toBe("all");
  });

  it("returns null when end is not today", () => {
    expect(matchPreset(daysAgoISO(7), daysAgoISO(1))).toBeNull();
  });

  it("returns null when start is off by one day from any preset", () => {
    expect(matchPreset(daysAgoISO(8), todayISO())).toBeNull();
  });

  it("returns null for arbitrary custom ranges", () => {
    expect(matchPreset("2026-04-01", "2026-05-08")).toBeNull();
  });
});

describe("rangeLabel", () => {
  it("returns the preset name when dates match a preset", () => {
    expect(rangeLabel(daysAgoISO(2), todayISO())).toBe("Last 2 days");
    expect(rangeLabel(daysAgoISO(7), todayISO())).toBe("Last 7 days");
    expect(rangeLabel(daysAgoISO(30), todayISO())).toBe("Last 30 days");
    expect(rangeLabel("2000-01-01", todayISO())).toBe("All time");
  });

  it("returns formatted date range when no preset matches (same year)", () => {
    expect(rangeLabel("2025-03-01", "2025-04-01")).toBe("Mar 1 – Apr 1, 2025");
  });

  it("returns formatted date range when years differ", () => {
    expect(rangeLabel("2025-12-28", "2026-01-03")).toBe(
      "Dec 28, 2025 – Jan 3, 2026"
    );
  });
});
