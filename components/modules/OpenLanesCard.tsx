import type { LaneWaitRow } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

export function OpenLanesCard({ waits }: { waits: LaneWaitRow[] }) {
  return (
    <DenseCard title="Open lanes / booths">
      <div className="space-y-2">
        {waits.map((w) => {
          const open = w.openBooths;
          const total = w.totalBooths;
          const pct = open != null && total ? Math.round((open / total) * 100) : null;
          return (
            <div key={w.laneType} className="flex flex-col gap-1 rounded border border-zinc-800/70 bg-black/20 p-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] text-zinc-300">{w.label}</div>
                <div className="font-mono text-sm text-zinc-50">
                  {open == null || total == null ? "—" : `${open}/${total}`}
                  {pct == null ? null : <span className="ml-2 text-[10px] text-zinc-500">({pct}%)</span>}
                </div>
              </div>
              {open != null && total ? (
                <div className="h-1.5 w-full overflow-hidden rounded bg-zinc-800">
                  <div className="h-full bg-cyan-600" style={{ width: `${pct}%` }} />
                </div>
              ) : null}
              <LiveMetaStrip meta={w.live} dense />
            </div>
          );
        })}
      </div>
    </DenseCard>
  );
}
