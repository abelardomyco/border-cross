"use client";

import Link from "next/link";
import type { LiveOutputMeta, RegionalOverview } from "@/lib/types/domain";
import { DenseCard } from "@/components/modules/DenseCard";
import { LiveMetaStrip } from "@/components/modules/LiveMetaStrip";
import { AlertsPanel } from "@/components/modules/AlertsPanel";

function fmtMin(n: number | null) {
  return n == null ? "—" : `${n}m`;
}

function LaneCell({
  label,
  official,
  predicted,
  tone,
}: {
  label: string;
  official: number | null;
  predicted: number;
  tone: "general" | "sentri" | "ped";
}) {
  const toneClass =
    tone === "sentri" ? "text-emerald-200" : tone === "ped" ? "text-amber-200" : "text-zinc-100";
  return (
    <div className="px-1.5 py-1">
      <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-600">{label}</div>
      <div className={`mt-1 font-mono text-[18px] font-semibold leading-none ${toneClass}`}>{fmtMin(official)}</div>
      <div className="mt-0.5 font-mono text-[10px] text-zinc-600">pred {predicted}m</div>
    </div>
  );
}

export function RegionalBoard({ overview }: { overview: RegionalOverview }) {
  return (
    <div className="space-y-2">
      <DenseCard title="Corridor snapshot">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-zinc-400">{overview.corridor}</div>
          <div className="font-mono text-[10px] text-zinc-500">generated {new Date(overview.generatedAt).toLocaleString()}</div>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {overview.ports.map((p) => {
            const meta: LiveOutputMeta = {
              asOf: overview.generatedAt,
              sourceTimestamp: p.sourceTimestamp,
              freshness: p.freshness,
              confidence: p.confidence,
              sources: [
                { id: "rollup", kind: "model_blend", label: "Regional rollup (mock)", observedAt: overview.generatedAt },
              ],
            };
            return (
              <Link
                key={p.slug}
                href={`/ports/${p.slug}`}
                className="block rounded-md border border-border bg-surface-2/40 p-3 shadow-sm shadow-black/30 hover:border-ops-teal/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[12px] font-semibold text-zinc-100">{p.name}</div>
                    <div className="mt-2 grid grid-cols-3 divide-x divide-border rounded-md bg-surface-1/30">
                      <LaneCell
                        label="General"
                        official={p.lanes.general.official}
                        predicted={p.lanes.general.predicted}
                        tone="general"
                      />
                      {p.lanes.sentri_ready ? (
                        <LaneCell
                          label="SENTRI / Ready"
                          official={p.lanes.sentri_ready.official}
                          predicted={p.lanes.sentri_ready.predicted}
                          tone="sentri"
                        />
                      ) : (
                        <div className="px-1.5 py-1">
                          <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-700">SENTRI / Ready</div>
                          <div className="mt-1 font-mono text-[18px] font-semibold leading-none text-zinc-700">—</div>
                          <div className="mt-0.5 font-mono text-[10px] text-zinc-700">pred —</div>
                        </div>
                      )}
                      {p.lanes.pedestrian ? (
                        <LaneCell
                          label="Pedestrian"
                          official={p.lanes.pedestrian.official}
                          predicted={p.lanes.pedestrian.predicted}
                          tone="ped"
                        />
                      ) : (
                        <div className="px-1.5 py-1">
                          <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-700">Pedestrian</div>
                          <div className="mt-1 font-mono text-[18px] font-semibold leading-none text-zinc-700">—</div>
                          <div className="mt-0.5 font-mono text-[10px] text-zinc-700">pred —</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-ops-teal">→</div>
                </div>
                <div className="mt-2">
                  <LiveMetaStrip meta={meta} dense />
                </div>
              </Link>
            );
          })}
        </div>
      </DenseCard>

      <AlertsPanel alerts={overview.regionalAlerts} />
    </div>
  );
}
