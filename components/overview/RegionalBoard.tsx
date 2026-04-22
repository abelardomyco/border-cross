"use client";

import Link from "next/link";
import type { LiveOutputMeta, RegionalOverview } from "@/lib/types/domain";
import { DenseCard } from "@/components/modules/DenseCard";
import { LiveMetaStrip } from "@/components/modules/LiveMetaStrip";
import { AlertsPanel } from "@/components/modules/AlertsPanel";
import { lightingPaletteForTimeZone, waitSeverity, waitSeverityTextClass } from "@/lib/ui/portLighting";
import { AtmosphereOverlay } from "@/components/ui/AtmosphereOverlay";

function fmtMin(n: number | null) {
  return n == null ? "—" : `${n}m`;
}

// SD–TJ initial ports are all Pacific time; this map makes the behavior explicit and is extendable.
const PORT_TIMEZONE: Record<string, string> = {
  "san-ysidro": "America/Los_Angeles",
  "otay-mesa": "America/Los_Angeles",
  tecate: "America/Los_Angeles",
  "calexico-west": "America/Los_Angeles",
  "calexico-east": "America/Los_Angeles",
};

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
  const sev = waitSeverity(official);
  const officialClass = waitSeverityTextClass(sev);
  const predictedClass = waitSeverityTextClass(waitSeverity(predicted));
  const labelClass =
    tone === "sentri" ? "text-emerald-300/70" : tone === "ped" ? "text-amber-300/70" : "text-zinc-500";
  return (
    <div className="px-1.5 py-1">
      <div className={`text-[9px] font-mono uppercase tracking-[0.18em] ${labelClass}`}>{label}</div>
      <div className={`mt-1 font-mono text-[18px] font-semibold leading-none ${officialClass}`}>{fmtMin(official)}</div>
      <div className={`mt-0.5 font-mono text-[10px] ${predictedClass}`}>pred {predicted}m</div>
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
            const tz = PORT_TIMEZONE[p.slug] ?? "America/Los_Angeles";
            const light = lightingPaletteForTimeZone(tz);
            return (
              <Link
                key={p.slug}
                href={`/ports/${p.slug}`}
                className="relative block overflow-hidden rounded-md border border-border p-3 shadow-sm shadow-black/30"
                style={{
                  background: `linear-gradient(180deg, ${light.from} 0%, ${light.to} 100%)`,
                  borderColor: `${light.accent}55`,
                }}
              >
                <AtmosphereOverlay phase={light.phase} accent={light.accent} />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-[12px] font-semibold text-zinc-100">{p.name}</div>
                      <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-400">
                        {light.conditions}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 divide-x rounded-md bg-black/20" style={{ borderColor: `${light.accent}22` }}>
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
                        <div className="px-1.5 py-1">
                          <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-amber-300/70">
                            Pedestrian
                          </div>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-baseline justify-between gap-2 font-mono">
                              <span className="text-[10px] text-zinc-500">East</span>
                              <span
                                className={`text-[18px] font-semibold leading-none ${waitSeverityTextClass(
                                  waitSeverity(p.lanes.pedestrian.east?.official),
                                )}`}
                              >
                                {fmtMin(p.lanes.pedestrian.east?.official ?? null)}
                              </span>
                              <span
                                className={`text-[10px] ${waitSeverityTextClass(
                                  waitSeverity(p.lanes.pedestrian.east?.predicted ?? null),
                                )}`}
                              >
                                {p.lanes.pedestrian.east?.predicted == null
                                  ? "pred —"
                                  : `pred ${p.lanes.pedestrian.east.predicted}m`}
                              </span>
                            </div>
                            <div className="flex items-baseline justify-between gap-2 font-mono">
                              <span className="text-[10px] text-zinc-500">West</span>
                              <span
                                className={`text-[18px] font-semibold leading-none ${waitSeverityTextClass(
                                  waitSeverity(p.lanes.pedestrian.west?.official),
                                )}`}
                              >
                                {fmtMin(p.lanes.pedestrian.west?.official ?? null)}
                              </span>
                              <span
                                className={`text-[10px] ${waitSeverityTextClass(
                                  waitSeverity(p.lanes.pedestrian.west?.predicted ?? null),
                                )}`}
                              >
                                {p.lanes.pedestrian.west?.predicted == null
                                  ? "pred —"
                                  : `pred ${p.lanes.pedestrian.west.predicted}m`}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-1.5 py-1">
                          <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-zinc-700">Pedestrian</div>
                          <div className="mt-1 font-mono text-[18px] font-semibold leading-none text-zinc-700">—</div>
                          <div className="mt-0.5 font-mono text-[10px] text-zinc-700">pred —</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: light.accent }}>
                    →
                  </div>
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
