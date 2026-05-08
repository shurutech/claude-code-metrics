export type PerDevLongRow = {
  day: string;
  user_email: string;
  total: number;
};

export type PerDevWideRow = { day: string; [email: string]: string | number };

export type PivotResult = {
  rows: PerDevWideRow[];
  emails: string[];
};

export function pivotPerDev(long: PerDevLongRow[]): PivotResult {
  if (long.length === 0) return { rows: [], emails: [] };

  const emailSet = new Set<string>();
  const byDay = new Map<string, Map<string, number>>();

  for (const r of long) {
    emailSet.add(r.user_email);
    if (!byDay.has(r.day)) byDay.set(r.day, new Map());
    byDay.get(r.day)!.set(r.user_email, r.total);
  }

  const emails = Array.from(emailSet).sort();
  const rows: PerDevWideRow[] = Array.from(byDay.keys())
    .sort()
    .map((day) => {
      const row: PerDevWideRow = { day };
      const dayMap = byDay.get(day)!;
      for (const email of emails) {
        row[email] = dayMap.get(email) ?? 0;
      }
      return row;
    });

  return { rows, emails };
}
