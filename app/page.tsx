import { parseDateParams, rangeLabel } from "@/lib/range";
import {
  queryKpi,
  queryDailyTotal,
  queryLocVsDevs,
} from "@/lib/queries";
import { DateRangePicker } from "./components/DateRangePicker";
import { KpiCard } from "./components/KpiCard";
import { DailyTotalChart } from "./components/DailyTotalChart";
import { LocVsDevsChart } from "./components/LocVsDevsChart";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const { start, end } = parseDateParams(await searchParams);
  const subtitle = rangeLabel(start, end);

  const [kpi, daily, combo] = await Promise.all([
    queryKpi(start, end),
    queryDailyTotal(start, end),
    queryLocVsDevs(start, end),
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-4 p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Claude Code Metrics
        </h1>
        <DateRangePicker start={start} end={end} />
      </header>

      <KpiCard
        label="Lines of code added"
        value={kpi.total}
        subtitle={subtitle}
      />
      <DailyTotalChart data={daily} />
      <LocVsDevsChart data={combo} />
    </main>
  );
}
