"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Range } from "@/lib/range";

const RANGES: Range[] = ["7d", "30d", "90d", "all"];

export function DateRangePicker({ current }: { current: Range }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setRange(r: Range) {
    const next = new URLSearchParams(params);
    next.set("range", r);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-sm">
      {RANGES.map((r) => {
        const active = r === current;
        return (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={
              "rounded px-3 py-1 text-sm font-medium transition " +
              (active
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100")
            }
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}
