"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  matchPreset,
  presetToDates,
  rangeLabel,
  PRESETS,
  type Preset,
} from "@/lib/range";

export function DateRangePicker({
  start,
  end,
}: {
  start: string;
  end: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pushDates(s: string, e: string) {
    const params = new URLSearchParams();
    params.set("start", s);
    params.set("end", e);
    router.push(`${pathname}?${params.toString()}`);
  }

  function selectPreset(p: Preset) {
    const { start: s, end: e } = presetToDates(p);
    pushDates(s, e);
    setOpen(false);
  }

  const activePreset = matchPreset(start, end);
  const label = rangeLabel(start, end);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-slate-500"
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>{label}</span>
        <span className="text-slate-400" aria-hidden>
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Date range"
          className="absolute right-0 z-10 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
        >
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Quick filters
          </p>
          <div className="mb-4 flex gap-1">
            {PRESETS.map((p) => {
              const active = p === activePreset;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => selectPreset(p)}
                  className={
                    "flex-1 rounded px-2 py-1 text-xs font-medium transition " +
                    (active
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100")
                  }
                >
                  {p}
                </button>
              );
            })}
          </div>

          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Custom range
          </p>
          <label className="mb-2 flex items-center justify-between gap-2 text-sm">
            <span className="text-slate-700">Start</span>
            <input
              type="date"
              value={start}
              max={end}
              onChange={(e) =>
                e.target.value && pushDates(e.target.value, end)
              }
              className="rounded border border-slate-200 px-2 py-1 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="flex items-center justify-between gap-2 text-sm">
            <span className="text-slate-700">End</span>
            <input
              type="date"
              value={end}
              min={start}
              onChange={(e) =>
                e.target.value && pushDates(start, e.target.value)
              }
              className="rounded border border-slate-200 px-2 py-1 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </label>
        </div>
      )}
    </div>
  );
}
