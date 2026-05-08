"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PerDevData } from "@/lib/types";

const PALETTE = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#06b6d4", // cyan
  "#6366f1", // indigo
  "#d946ef", // fuchsia
  "#14b8a6", // teal
  "#0ea5e9", // sky
  "#f97316", // orange
  "#ec4899", // pink
  "#84cc16", // lime
  "#ef4444", // red
];

function colorForEmail(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = (h * 31 + email.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(h) % PALETTE.length];
}

export function PerDeveloperChart({ data }: { data: PerDevData }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Lines per developer per day
      </h2>
      {data.rows.length === 0 ? (
        <p className="mt-12 text-center text-sm text-slate-500">
          No data for selected range.
        </p>
      ) : (
        <div className="mt-4 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.rows}
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
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {data.emails.map((email) => (
                <Bar
                  key={email}
                  dataKey={email}
                  name={email}
                  stackId="loc"
                  fill={colorForEmail(email)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
