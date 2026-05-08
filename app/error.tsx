"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-4 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="text-slate-600">
        We couldn&apos;t load the metrics. The database may be unreachable.
      </p>
      <pre className="max-w-full overflow-x-auto rounded bg-slate-100 p-3 text-xs text-slate-700">
        {error.message}
      </pre>
      <button
        type="button"
        onClick={reset}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  );
}
