import type { LaneWaitRow } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

function laneTag(l: LaneWaitRow["laneType"]) {
  if (l === "car") return "CAR";
  if (l === "pedestrian") return "PED";
  if (l === "sentri_ready") return "SENTRI";
  return "COMM";
}

export function PredictedWaitCard({ waits }: { waits: LaneWaitRow[] }) {
  return (
    <DenseCard title="Predicted true crossing time">
      <p className="mb-2 text-[10px] text-zinc-500">
        Model blends official signal, approach delay, queue CV pressure, and source lag. Replace with production inference
        in <span className="font-mono text-zinc-400">lib/prediction</span>.
      </p>
      <div className="space-y-2">
        {waits.map((w) => {
          const delta =
            w.officialMinutes == null ? null : Math.round(w.predictedTrueMinutes - w.officialMinutes);
          return (
            <div key={w.laneType} className="rounded border border-zinc-800/70 bg-black/20 p-1.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-zinc-800 px-1 py-0.5 text-[9px] text-amber-200">{laneTag(w.laneType)}</span>
                    <span className="text-[11px] text-zinc-300">{w.label}</span>
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <div className="font-mono text-lg font-semibold text-amber-100">{w.predictedTrueMinutes}m</div>
                    {delta == null ? (
                      <div className="text-[10px] text-zinc-500">no official baseline</div>
                    ) : (
                      <div className={`text-[10px] font-mono ${delta > 0 ? "text-rose-300" : "text-emerald-300"}`}>
                        {delta > 0 ? `+${delta}m vs official` : `${delta}m vs official`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <LiveMetaStrip meta={w.live} dense />
            </div>
          );
        })}
      </div>
    </DenseCard>
  );
}
