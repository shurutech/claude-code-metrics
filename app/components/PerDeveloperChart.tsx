"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
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

type TooltipEntry = {
  name?: string | number;
  value?: number | string | (number | string)[];
  color?: string;
  dataKey?: string | number;
};

function PerDevTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const sorted = [...payload].sort((a, b) => {
    const av = typeof a.value === "number" ? a.value : 0;
    const bv = typeof b.value === "number" ? b.value : 0;
    return bv - av;
  });

  return (
    <div className="relative z-50 max-w-xs rounded-md border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-slate-900">{label}</p>
      <ul className="mt-1 space-y-0.5">
        {sorted.map((entry) => (
          <li
            key={String(entry.dataKey ?? entry.name)}
            className="flex items-center gap-2 text-xs"
          >
            <span
              aria-hidden
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color ?? "#94a3b8" }}
            />
            <span className="truncate text-slate-600">{entry.name}</span>
            <span className="ml-auto font-medium text-slate-900">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : String(entry.value ?? "")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PerDevLegend({
  emails,
  focused,
  onSelect,
}: {
  emails: string[];
  focused: string | null;
  onSelect: (email: string) => void;
}) {
  return (
    <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
      {emails.map((email) => {
        const isActive = focused === null || focused === email;
        const isFocused = focused === email;
        return (
          <li key={email}>
            <button
              type="button"
              onClick={() => onSelect(email)}
              aria-pressed={isFocused}
              className={
                "flex items-center gap-1.5 rounded px-1.5 py-0.5 transition " +
                (isActive
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-slate-400 hover:text-slate-600") +
                (isFocused ? " bg-slate-100" : "")
              }
              title={
                isFocused
                  ? "Click again to show all"
                  : "Click to show only this developer"
              }
            >
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{
                  backgroundColor: isActive
                    ? colorForEmail(email)
                    : "#cbd5e1",
                }}
              />
              <span className="max-w-[180px] truncate">{email}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function PerDeveloperChart({ data }: { data: PerDevData }) {
  const [focused, setFocused] = useState<string | null>(null);

  function toggle(email: string) {
    setFocused((current) => (current === email ? null : email));
  }

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
        <>
          <div className="mt-4 h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
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
                  content={<PerDevTooltip />}
                  cursor={{ stroke: "#cbd5e1", strokeDasharray: "3 3" }}
                />
                {data.emails.map((email) => (
                  <Line
                    key={email}
                    type="monotone"
                    dataKey={email}
                    name={email}
                    stroke={colorForEmail(email)}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    hide={focused !== null && focused !== email}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <PerDevLegend
            emails={data.emails}
            focused={focused}
            onSelect={toggle}
          />
        </>
      )}
    </div>
  );
}
