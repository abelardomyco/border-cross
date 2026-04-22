import type { CommercialSnapshot } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

export function CommercialCrossingPanel({ commercial }: { commercial: CommercialSnapshot }) {
  return (
    <DenseCard title="Commercial crossing">
      {!commercial.enabled ? (
        <div className="space-y-2">
          <div className="text-[11px] text-zinc-400">{commercial.notes}</div>
          <LiveMetaStrip meta={commercial.live} dense />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded border border-zinc-800/70 bg-black/20 p-1.5">
            <div className="text-[10px] text-zinc-500">Drayage delay (empty)</div>
            <div className="mt-1 font-mono text-lg text-zinc-50">
              {commercial.drayageDelayMinutes == null ? "—" : `${commercial.drayageDelayMinutes}m`}
            </div>
          </div>
          <div className="rounded border border-zinc-800/70 bg-black/20 p-1.5">
            <div className="text-[10px] text-zinc-500">Open commercial lanes</div>
            <div className="mt-1 font-mono text-lg text-zinc-50">{commercial.openCommercialLanes ?? "—"}</div>
          </div>
          <div className="col-span-2 rounded border border-zinc-800/70 bg-black/20 p-1.5">
            <div className="text-[10px] text-zinc-500">Inspections / hour (mock)</div>
            <div className="mt-1 font-mono text-lg text-zinc-50">{commercial.inspectionsPerHour ?? "—"}</div>
            <div className="mt-1 text-[10px] text-zinc-500">{commercial.notes}</div>
            <div className="mt-2">
              <LiveMetaStrip meta={commercial.live} dense />
            </div>
          </div>
        </div>
      )}
    </DenseCard>
  );
}
