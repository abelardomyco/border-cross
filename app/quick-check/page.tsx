"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { RefreshBadge } from "@/components/shell/RefreshBadge";
import { LiveMetaStrip } from "@/components/modules/LiveMetaStrip";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";
import type { PortSnapshot } from "@/lib/types/domain";

const DEFAULT_SLUG = "san-ysidro";

function fmtMin(n: number | null | undefined) {
  return n == null ? "—" : `${n}m`;
}

function LaneRow({
  label,
  official,
  predicted,
}: {
  label: string;
  official: number | null | undefined;
  predicted: number | null | undefined;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-end gap-3 border-t border-zinc-900/70 pt-2 first:border-t-0 first:pt-0">
      <div className="text-[11px] text-zinc-400">{label}</div>
      <div className="flex items-baseline gap-2 font-mono">
        <div className="text-[22px] font-semibold text-zinc-50">{fmtMin(official)}</div>
        <div className="text-[11px] text-amber-200">{predicted == null ? "pred —" : `pred ${predicted}m`}</div>
      </div>
    </div>
  );
}

export default function QuickCheckPage() {
  const [slug, setSlug] = useState(DEFAULT_SLUG);
  const url = useMemo(() => `/api/ports/${encodeURIComponent(slug)}`, [slug]);
  const { data, error, loading, lastFetchAt, refetch } = useDashboardRefresh<PortSnapshot>(url, 30_000);

  const car = data?.waits.find((w) => w.laneType === "car");
  const ped = data?.waits.find((w) => w.laneType === "pedestrian");
  const sentri = data?.waits.find((w) => w.laneType === "sentri_ready");

  return (
    <AppShell
      title="Quick check (traveler mode)"
      subtitle="Mobile-first: General + SENTRI/Ready + Pedestrian in one glance. Still refreshes every 30s."
      right={<RefreshBadge lastFetchAt={lastFetchAt} intervalSec={30} error={error} />}
    >
      <div className="pb-24">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-[12px] text-zinc-400">
          Port{" "}
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="ml-1 w-full rounded border border-zinc-800 bg-zinc-950 px-2 py-2 font-mono text-[12px] text-zinc-100 sm:w-auto"
          >
            <option value="san-ysidro">San Ysidro</option>
            <option value="otay-mesa">Otay Mesa</option>
            <option value="tecate">Tecate</option>
            <option value="calexico-west">Calexico West</option>
            <option value="calexico-east">Calexico East</option>
          </select>
        </label>
        <Link href={`/ports/${slug}`} className="text-center text-[11px] text-cyan-300 underline sm:text-right">
          Open full port dashboard →
        </Link>
      </div>

      {loading && !data ? <div className="py-10 text-center text-[12px] text-zinc-500">Loading…</div> : null}

      {data && car ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
            <div className="text-[10px] font-mono uppercase tracking-wide text-zinc-500">Official + predicted (same card)</div>
            <div className="mt-3 space-y-2">
              <LaneRow label="General (car)" official={car.officialMinutes} predicted={car.predictedTrueMinutes} />
              <LaneRow
                label="SENTRI / Ready"
                official={sentri?.officialMinutes}
                predicted={sentri?.predictedTrueMinutes}
              />
              <LaneRow label="Pedestrian" official={ped?.officialMinutes} predicted={ped?.predictedTrueMinutes} />
            </div>
            <div className="mt-3">
              <LiveMetaStrip meta={car.live} />
            </div>
          </div>
        </div>
      ) : null}

      {!loading && !data ? (
        <div className="space-y-2">
          <div className="rounded border border-rose-900/50 bg-rose-950/20 p-3 text-[12px] text-rose-200">
            Could not load quick check{error ? `: ${error}` : ""}.
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="w-full rounded border border-zinc-700 bg-zinc-900 py-2 text-[12px] text-zinc-200"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="fixed bottom-0 left-0 right-0 border-t border-zinc-800 bg-[#070a0f]/95 px-3 py-2 text-center text-[10px] text-zinc-500 backdrop-blur">
        Mock data only · pull cadence 30s ·{" "}
        <button type="button" className="text-cyan-300 underline" onClick={() => void refetch()}>
          refresh now
        </button>
      </div>
      </div>
    </AppShell>
  );
}
