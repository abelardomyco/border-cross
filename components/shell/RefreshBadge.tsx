"use client";

export function RefreshBadge({
  lastFetchAt,
  intervalSec,
  error,
}: {
  lastFetchAt: string | null;
  intervalSec: number;
  error: string | null;
}) {
  return (
    <div className="flex flex-col items-end gap-0.5 text-right">
      <div className="rounded border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[10px] text-zinc-400">
        UI refresh <span className="text-cyan-300/90">{intervalSec}s</span>
        {lastFetchAt ? (
          <>
            {" "}
            · last pull <span className="text-zinc-200">{new Date(lastFetchAt).toLocaleTimeString()}</span>
          </>
        ) : null}
      </div>
      {error ? <div className="max-w-[320px] text-[10px] text-rose-300">{error}</div> : null}
    </div>
  );
}
