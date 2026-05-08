import { parseRange, rangeToDates } from "@/lib/range";
import {
  queryKpi,
  queryDailyTotal,
  queryPerDev,
  queryLocVsDevs,
} from "@/lib/queries";
import { DateRangePicker } from "./components/DateRangePicker";
import { KpiCard } from "./components/KpiCard";
import { DailyTotalChart } from "./components/DailyTotalChart";
import { PerDeveloperChart } from "./components/PerDeveloperChart";
import { LocVsDevsChart } from "./components/LocVsDevsChart";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const range = parseRange((await searchParams).range);
  const { start, end } = rangeToDates(range);

  const [kpi, daily, perDev, combo] = await Promise.all([
    queryKpi(start, end),
    queryDailyTotal(start, end),
    queryPerDev(start, end),
    queryLocVsDevs(start, end),
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Claude Code Metrics
        </h1>
        <DateRangePicker current={range} />
      </header>

      <KpiCard
        label="Lines of code added"
        value={kpi.total}
        range={range}
      />
      <DailyTotalChart data={daily} />
      <PerDeveloperChart data={perDev} />
      <LocVsDevsChart data={combo} />
    </main>
  );
}
