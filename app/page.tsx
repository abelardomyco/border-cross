"use client";

import { AppShell } from "@/components/shell/AppShell";
import { RefreshBadge } from "@/components/shell/RefreshBadge";
import { RegionalBoard } from "@/components/overview/RegionalBoard";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";
import type { RegionalOverview } from "@/lib/types/domain";

export default function HomePage() {
  const { data, error, loading, lastFetchAt, refetch } = useDashboardRefresh<RegionalOverview>("/api/live", 30_000);

  return (
    <AppShell
      title="Regional overview"
      subtitle="San Ysidro, Otay Mesa, Tecate, Calexico West, Calexico East — mock live feeds"
      right={<RefreshBadge lastFetchAt={lastFetchAt} intervalSec={30} error={error} />}
    >
      {loading && !data ? (
        <div className="rounded border border-zinc-800 bg-zinc-950/40 p-4 font-mono text-[11px] text-zinc-500">Loading…</div>
      ) : null}
      {data ? <RegionalBoard overview={data} /> : null}
      {!loading && !data ? (
        <div className="space-y-2">
          <div className="rounded border border-rose-900/50 bg-rose-950/20 p-3 text-[11px] text-rose-200">
            Could not load regional snapshot{error ? `: ${error}` : ""}.
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded border border-zinc-700 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-200"
          >
            Retry
          </button>
        </div>
      ) : null}
    </AppShell>
  );
}
