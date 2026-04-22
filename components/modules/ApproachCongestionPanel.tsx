import type { ApproachSegment } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

export function ApproachCongestionPanel({ segments }: { segments: ApproachSegment[] }) {
  return (
    <DenseCard title="Approach congestion">
      <p className="mb-2 text-[10px] text-zinc-500">
        Google Routes-style delay add-ons (mock). Future: bind polylines per port and normalize freeflow vs traffic.
      </p>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.id} className="rounded border border-zinc-800/70 bg-black/20 p-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] text-zinc-200">{s.name}</div>
              <div className="font-mono text-[11px] text-amber-200">+{s.delayAddMinutes}m</div>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded bg-zinc-800">
              <div className="h-full bg-amber-600/70" style={{ width: `${s.congestion}%` }} />
            </div>
            <div className="mt-1 text-[10px] text-zinc-500">
              Congestion index <span className="font-mono text-zinc-300">{s.congestion}</span> / 100
            </div>
            <LiveMetaStrip meta={s.live} dense />
          </div>
        ))}
      </div>
    </DenseCard>
  );
}
