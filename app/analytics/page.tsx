"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { RefreshBadge } from "@/components/shell/RefreshBadge";
import { DenseCard } from "@/components/modules/DenseCard";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";
import type { AnalyticsBundle } from "@/lib/types/domain";

const SLUGS = ["all", "san-ysidro", "otay-mesa", "tecate", "calexico-west", "calexico-east"] as const;

export default function AnalyticsPage() {
  const [slug, setSlug] = useState<(typeof SLUGS)[number]>("all");
  const url = useMemo(() => `/api/analytics?slug=${encodeURIComponent(slug)}`, [slug]);
  const { data, error, loading, lastFetchAt, refetch } = useDashboardRefresh<AnalyticsBundle>(url, 30_000);

  const peak = useMemo(() => {
    if (!data) return 1;
    return Math.max(...data.series.map((p) => Math.max(p.officialCar, p.predictedCar)), 1);
  }, [data]);

  return (
    <AppShell
      title="Historical analytics"
      subtitle="Mock series for UI wiring — replace with warehouse queries + seasonal models"
      right={<RefreshBadge lastFetchAt={lastFetchAt} intervalSec={30} error={error} />}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <label className="text-[11px] text-zinc-500">
          Slice{" "}
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value as (typeof SLUGS)[number])}
            className="ml-1 rounded border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px] text-zinc-200"
          >
            {SLUGS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-200"
        >
          Pull now
        </button>
      </div>

      {loading && !data ? <div className="text-[11px] text-zinc-500">Loading…</div> : null}

      {data ? (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          <DenseCard title="Car wait: official vs predicted (mock)">
            <div className="flex h-44 items-end gap-0.5 overflow-x-auto">
              {data.series.map((p) => (
                <div key={p.t} className="flex w-2 flex-col justify-end gap-0.5" title={new Date(p.t).toISOString()}>
                  <div className="w-2 rounded-sm bg-cyan-700/70" style={{ height: `${(p.officialCar / peak) * 100}%` }} />
                  <div
                    className="w-2 rounded-sm bg-amber-600/60"
                    style={{ height: `${(p.predictedCar / peak) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-zinc-600">
              Cyan = official (mock) · Amber = predicted (mock). Future: credible intervals + lane splits.
            </div>
          </DenseCard>

          <DenseCard title="Dwell histogram (mock)">
            <div className="flex h-44 items-end gap-1">
              {data.dwellHistogram.map((h, idx) => (
                <div key={idx} className="flex-1">
                  <div className="mx-auto w-full max-w-[18px] rounded-sm bg-fuchsia-700/70" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 text-[10px] text-zinc-600">Bucket labels to be tied to telemetry ingestion.</div>
          </DenseCard>
        </div>
      ) : null}

      {!loading && !data ? (
        <div className="rounded border border-rose-900/50 bg-rose-950/20 p-3 text-[11px] text-rose-200">
          Could not load analytics{error ? `: ${error}` : ""}.
        </div>
      ) : null}
    </AppShell>
  );
}
