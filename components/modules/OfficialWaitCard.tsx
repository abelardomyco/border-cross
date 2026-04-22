import type { LaneWaitRow } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

function laneTag(l: LaneWaitRow["laneType"]) {
  if (l === "car") return "CAR";
  if (l === "pedestrian") return "PED";
  if (l === "sentri_ready") return "SENTRI";
  return "COMM";
}

export function OfficialWaitCard({ waits }: { waits: LaneWaitRow[] }) {
  return (
    <DenseCard title="Official wait (CBP)">
      <div className="space-y-2">
        {waits.map((w) => (
          <div key={w.laneType} className="rounded border border-zinc-800/70 bg-black/20 p-1.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-zinc-800 px-1 py-0.5 text-[9px] text-cyan-200">{laneTag(w.laneType)}</span>
                  <span className="text-[11px] text-zinc-300">{w.label}</span>
                </div>
                <div className="mt-1 font-mono text-lg font-semibold text-zinc-50">
                  {w.officialMinutes == null ? "—" : `${w.officialMinutes}m`}
                </div>
              </div>
            </div>
            <LiveMetaStrip meta={w.live} dense />
          </div>
        ))}
      </div>
    </DenseCard>
  );
}
