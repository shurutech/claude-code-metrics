export type Range = "7d" | "30d" | "90d" | "all";

const VALID: Range[] = ["7d", "30d", "90d", "all"];

export function parseRange(raw: string | undefined): Range {
  if (raw && (VALID as string[]).includes(raw)) return raw as Range;
  return "30d";
}

export function rangeToDates(r: Range): { start: string; end: string } {
  const end = new Date().toISOString().slice(0, 10);
  if (r === "all") return { start: "2000-01-01", end };
  const days = r === "7d" ? 7 : r === "30d" ? 30 : 90;
  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - days);
  return { start: startDate.toISOString().slice(0, 10), end };
}
