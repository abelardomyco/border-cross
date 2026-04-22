import type { HourlyCell } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";

const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function cellColor(intensity: number) {
  const a = Math.min(100, intensity) / 100;
  const hue = 200 - a * 120;
  return `hsla(${hue}, 70%, ${18 + a * 32}%, ${0.35 + a * 0.55})`;
}

export function HourlyRhythmHeatmap({ cells }: { cells: HourlyCell[] }) {
  const byDow: HourlyCell[][] = Array.from({ length: 7 }, (_, dow) =>
    cells.filter((c) => c.dow === dow).sort((a, b) => a.hour - b.hour),
  );

  return (
    <DenseCard title="Hourly rhythm (7×24)">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="mb-1 grid grid-cols-[44px_repeat(24,minmax(0,1fr))] gap-px text-[9px] text-zinc-500">
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-center font-mono">
                {h}
              </div>
            ))}
          </div>
          {byDow.map((row, idx) => (
            <div key={dow[idx]} className="mb-px grid grid-cols-[44px_repeat(24,minmax(0,1fr))] gap-px">
              <div className="flex items-center pr-1 text-[10px] text-zinc-400">{dow[idx]}</div>
              {row.map((c) => (
                <div
                  key={`${c.dow}-${c.hour}`}
                  className="h-4 rounded-sm border border-zinc-900/40"
                  style={{ background: cellColor(c.intensity) }}
                  title={`${dow[c.dow]} ${c.hour}:00 · intensity ${c.intensity}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 text-[10px] text-zinc-600">
        Built from seed hourly profile × day-of-week bias (mock). Future: learn from historical true crossing telemetry.
      </div>
    </DenseCard>
  );
}
