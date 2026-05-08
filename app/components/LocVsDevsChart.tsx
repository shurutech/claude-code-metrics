"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { LocVsDevsRow } from "@/lib/types";

export function LocVsDevsChart({ data }: { data: LocVsDevsRow[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Lines added vs active developers
      </h2>
      {data.length === 0 ? (
        <p className="mt-12 text-center text-sm text-slate-500">
          No data for selected range.
        </p>
      ) : (
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.toLocaleString()}
                width={72}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                allowDecimals={false}
                width={48}
              />
              <Tooltip
                formatter={(v) =>
                  v == null ? "" : Number(v).toLocaleString()
                }
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                yAxisId="left"
                dataKey="totalLoc"
                name="Lines added"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="activeDevs"
                name="Active developers"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
