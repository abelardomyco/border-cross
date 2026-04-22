import type { BestWindow } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";

export function BestTimeToCrossPanel({ windows }: { windows: BestWindow[] }) {
  return (
    <DenseCard title="Best time to cross">
      <div className="space-y-2">
        {windows.map((w, i) => (
          <div key={`${w.startLocal}-${i}`} className="rounded border border-zinc-800/70 bg-black/20 p-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-[12px] text-zinc-100">
                {w.startLocal}–{w.endLocal}
              </div>
              <div className="text-[10px] font-mono text-emerald-300">score {(w.score * 100).toFixed(0)}</div>
            </div>
            <div className="mt-1 text-[10px] text-zinc-500">{w.reason}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-zinc-600">
        Future: personalize by lane type, weekday commute patterns, and commercial embargo windows.
      </div>
    </DenseCard>
  );
}
