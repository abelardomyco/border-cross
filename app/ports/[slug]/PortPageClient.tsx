"use client";

import { AppShell } from "@/components/shell/AppShell";
import { RefreshBadge } from "@/components/shell/RefreshBadge";
import { PortModuleGrid } from "@/components/ports/PortModuleGrid";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";
import type { PortSnapshot } from "@/lib/types/domain";

export function PortPageClient({ slug }: { slug: string }) {
  const { data, error, loading, lastFetchAt, refetch } = useDashboardRefresh<PortSnapshot>(`/api/ports/${slug}`, 30_000);

  return (
    <AppShell
      title={data?.name ?? "Port"}
      subtitle={data ? `${data.corridor} · layout ${data.layout.variant}` : "Loading port modules…"}
      right={<RefreshBadge lastFetchAt={lastFetchAt} intervalSec={30} error={error} />}
    >
      {loading && !data ? (
        <div className="rounded border border-zinc-800 bg-zinc-950/40 p-4 font-mono text-[11px] text-zinc-500">Loading…</div>
      ) : null}
      {data ? <PortModuleGrid snap={data} /> : null}
      {!loading && !data ? (
        <div className="space-y-2">
          <div className="rounded border border-rose-900/50 bg-rose-950/20 p-3 text-[11px] text-rose-200">
            Could not load port{error ? `: ${error}` : ""}.
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
