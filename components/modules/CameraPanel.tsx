import type { CameraFrame } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

export function CameraPanel({ cameras }: { cameras: CameraFrame[] }) {
  return (
    <DenseCard title="Cameras / screenshot evidence">
      <p className="mb-2 text-[10px] text-zinc-500">
        Treat stills as ingestible evidence for queue estimation. Admin uploads map to port + lane + timestamp for CV
        calibration.
      </p>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {cameras.map((c) => (
          <div key={c.id} className="overflow-hidden rounded border border-zinc-800/80 bg-black/30">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 px-2 py-1">
              <div className="text-[11px] text-zinc-200">{c.title}</div>
              {c.laneHint ? (
                <span className="rounded bg-zinc-800 px-1 py-0.5 text-[9px] font-mono text-zinc-300">{c.laneHint}</span>
              ) : null}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.imageUrl} alt="" className="h-40 w-full object-cover opacity-90" />
            <div className="space-y-1 p-1.5">
              <div className="text-[10px] text-zinc-500">
                Frame captured <span className="font-mono text-zinc-300">{new Date(c.capturedAt).toLocaleString()}</span>
              </div>
              <LiveMetaStrip meta={c.live} dense />
            </div>
          </div>
        ))}
      </div>
    </DenseCard>
  );
}
