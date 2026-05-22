export function KpiCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-12 shadow-sm">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 text-blue-500"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <p className="text-xl font-bold tracking-tight text-slate-900">
          {label}
        </p>
      </div>
      <p className="mt-6 text-7xl font-extrabold tracking-tight text-slate-900 sm:text-8xl">
        {value.toLocaleString()}
      </p>
      <p className="mt-4 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}
