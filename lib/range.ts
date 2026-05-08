export type Preset = "2d" | "7d" | "30d" | "all";
export const PRESETS: Preset[] = ["2d", "7d", "30d", "all"];

const DEFAULT_LOOKBACK_DAYS = 30;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function isValidISODate(s: unknown): s is string {
  if (typeof s !== "string" || !ISO_DATE.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function defaultRange(): { start: string; end: string } {
  return { start: daysAgoISO(DEFAULT_LOOKBACK_DAYS), end: todayISO() };
}

export function parseDateParams(raw: {
  start?: string;
  end?: string;
}): { start: string; end: string } {
  if (!isValidISODate(raw.start) || !isValidISODate(raw.end)) {
    return defaultRange();
  }
  if (raw.start > raw.end) return { start: raw.end, end: raw.start };
  return { start: raw.start, end: raw.end };
}

export function presetToDates(p: Preset): { start: string; end: string } {
  const end = todayISO();
  if (p === "all") return { start: "2000-01-01", end };
  const days = p === "2d" ? 2 : p === "7d" ? 7 : 30;
  return { start: daysAgoISO(days), end };
}

export function matchPreset(start: string, end: string): Preset | null {
  for (const p of PRESETS) {
    const dates = presetToDates(p);
    if (dates.start === start && dates.end === end) return p;
  }
  return null;
}

export function rangeLabel(start: string, end: string): string {
  const preset = matchPreset(start, end);
  if (preset === "all") return "All time";
  if (preset) return `Last ${preset.replace("d", "")} days`;

  const s = new Date(start + "T00:00:00Z");
  const e = new Date(end + "T00:00:00Z");
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  const fmt = (d: Date, withYear: boolean) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(withYear ? { year: "numeric" } : {}),
      timeZone: "UTC",
    });
  if (sameYear) return `${fmt(s, false)} – ${fmt(e, true)}`;
  return `${fmt(s, true)} – ${fmt(e, true)}`;
}
