import type { Range } from "@/lib/range";

const RANGE_LABEL: Record<Range, string> = {
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 90 days",
  all: "all time",
};

export function KpiCard({
  label,
  value,
  range,
}: {
  label: string;
  value: number;
  range: Range;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-slate-500">{RANGE_LABEL[range]}</p>
    </div>
  );
}
