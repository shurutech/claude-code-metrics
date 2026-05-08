import { unstable_cache } from "next/cache";
import sql from "./db";
import { pivotPerDev, type PerDevLongRow } from "./pivot";
import type {
  KpiData,
  DailyTotalRow,
  LocVsDevsRow,
  PerDevData,
} from "./types";

const REVALIDATE_SECONDS = 3600;

async function _queryKpi(start: string, end: string): Promise<KpiData> {
  const rows = await sql<{ total: string }[]>`
    SELECT COALESCE(SUM(lines_added), 0)::bigint AS total
    FROM claude_code_daily_loc
    WHERE day BETWEEN ${start} AND ${end}
  `;
  return { total: Number(rows[0].total) };
}

async function _queryDailyTotal(
  start: string,
  end: string
): Promise<DailyTotalRow[]> {
  const rows = await sql<{ day: Date; total: string }[]>`
    SELECT day, SUM(lines_added)::bigint AS total
    FROM claude_code_daily_loc
    WHERE day BETWEEN ${start} AND ${end}
    GROUP BY day
    ORDER BY day
  `;
  return rows.map((r) => ({
    day: r.day.toISOString().slice(0, 10),
    total: Number(r.total),
  }));
}

async function _queryPerDev(start: string, end: string): Promise<PerDevData> {
  const rows = await sql<
    { day: Date; user_email: string; total: string }[]
  >`
    SELECT day, user_email, SUM(lines_added)::bigint AS total
    FROM claude_code_daily_loc
    WHERE day BETWEEN ${start} AND ${end}
    GROUP BY day, user_email
    ORDER BY day, user_email
  `;
  const long: PerDevLongRow[] = rows.map((r) => ({
    day: r.day.toISOString().slice(0, 10),
    user_email: r.user_email,
    total: Number(r.total),
  }));
  return pivotPerDev(long);
}

async function _queryLocVsDevs(
  start: string,
  end: string
): Promise<LocVsDevsRow[]> {
  const rows = await sql<
    { day: Date; total_loc: string; active_devs: number }[]
  >`
    SELECT day,
           SUM(lines_added)::bigint AS total_loc,
           COUNT(DISTINCT user_email)::int AS active_devs
    FROM claude_code_daily_loc
    WHERE day BETWEEN ${start} AND ${end}
    GROUP BY day
    ORDER BY day
  `;
  return rows.map((r) => ({
    day: r.day.toISOString().slice(0, 10),
    totalLoc: Number(r.total_loc),
    activeDevs: r.active_devs,
  }));
}

const cacheOpts = { revalidate: REVALIDATE_SECONDS, tags: ["metrics"] };

export const queryKpi = unstable_cache(_queryKpi, ["kpi"], cacheOpts);
export const queryDailyTotal = unstable_cache(
  _queryDailyTotal,
  ["daily-total"],
  cacheOpts
);
export const queryPerDev = unstable_cache(_queryPerDev, ["per-dev"], cacheOpts);
export const queryLocVsDevs = unstable_cache(
  _queryLocVsDevs,
  ["loc-vs-devs"],
  cacheOpts
);
