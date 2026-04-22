import type { VideoFlowSegment } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

function stateTone(s: VideoFlowSegment["state"]) {
  if (s === "blocked") return "text-rose-200";
  if (s === "stop_go") return "text-amber-200";
  if (s === "dense") return "text-zinc-200";
  return "text-emerald-200";
}

export function VideoFlowAnalysisPanel({ segments }: { segments: VideoFlowSegment[] }) {
  return (
    <DenseCard title="Video AI flow analysis (along approach)">
      <p className="mb-2 text-[10px] text-zinc-500">
        Along-road camera CV estimates discharge/flow rate and stop-go state; this signal feeds the predicted true wait
        model (mock wiring).
      </p>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.id} className="rounded border border-zinc-800/70 bg-black/20 p-1.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] text-zinc-200">{s.name}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-zinc-200">{s.flowRateVpm} vpm</span>
                  <span className="text-zinc-500">bottleneck</span>
                  <span className="text-zinc-200">{s.bottleneckScore}/100</span>
                  <span className={`ml-1 ${stateTone(s.state)}`}>{s.state.toUpperCase()}</span>
                  <span className="text-zinc-600">cam</span>
                  <span className="text-zinc-400">{s.cameraId}</span>
                </div>
              </div>
              <div className="h-2 w-24 overflow-hidden rounded bg-zinc-800">
                <div className="h-full bg-rose-600/70" style={{ width: `${s.bottleneckScore}%` }} />
              </div>
            </div>
            <LiveMetaStrip meta={s.live} dense />
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-zinc-600">
        Future: per-lane discharge, headway distributions, and anomaly detection (incidents, closures, surge waves).
      </div>
    </DenseCard>
  );
}

