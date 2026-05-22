"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TokenDailyRow } from "@/lib/types";
import { formatTokens } from "@/lib/format";

export function TokenDailyChart({ data }: { data: TokenDailyRow[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        Tokens per day
      </h2>
      {data.length === 0 ? (
        <p className="mt-12 text-center text-sm text-slate-500">
          No data for selected range.
        </p>
      ) : (
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatTokens(Number(v))}
                width={64}
              />
              <Tooltip
                formatter={(v) =>
                  v == null ? "" : formatTokens(Number(v))
                }
              />
              <Bar
                dataKey="total"
                name="Tokens"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
