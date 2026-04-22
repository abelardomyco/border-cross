import type { QueueEstimateRow } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

export function QueueEstimatePanel({ rows }: { rows: QueueEstimateRow[] }) {
  return (
    <DenseCard title="Queue estimate (CV + fusion)">
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.laneType} className="rounded border border-zinc-800/70 bg-black/20 p-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11px] text-zinc-300">{r.label}</div>
              <div className="font-mono text-[11px] text-zinc-400">{r.evidenceKinds.join(" + ")}</div>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded bg-zinc-800">
                <div className="h-full bg-fuchsia-700/80" style={{ width: `${r.pressure}%` }} />
              </div>
              <div className="w-10 text-right font-mono text-sm text-zinc-100">{r.pressure}</div>
            </div>
            <ul className="mt-1 list-inside list-disc text-[10px] text-zinc-500">
              {r.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <LiveMetaStrip meta={r.live} dense />
          </div>
        ))}
      </div>
    </DenseCard>
  );
}
