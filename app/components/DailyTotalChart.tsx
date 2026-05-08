"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyTotalRow } from "@/lib/types";

export function DailyTotalChart({ data }: { data: DailyTotalRow[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Total lines added per day
      </h2>
      {data.length === 0 ? (
        <p className="mt-12 text-center text-sm text-slate-500">
          No data for selected range.
        </p>
      ) : (
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.toLocaleString()}
                width={72}
              />
              <Tooltip
                formatter={(v) =>
                  v == null ? "" : Number(v).toLocaleString()
                }
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Lines added"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
