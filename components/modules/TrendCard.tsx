import type { TrendPoint } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";

export function TrendCard({ points }: { points: TrendPoint[] }) {
  const last = points[points.length - 1];
  const peakCar = Math.max(...points.map((p) => p.car), 1);
  const peakPed = Math.max(...points.map((p) => p.pedestrian), 1);

  return (
    <DenseCard
      title="Trend (recent)"
      right={
        last ? (
          <div className="text-[10px] font-mono text-zinc-500">
            now <span className="text-zinc-200">{last.car}m</span> car ·{" "}
            <span className="text-zinc-200">{last.pedestrian}m</span> ped
          </div>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="mb-1 text-[10px] text-zinc-500">Car (official series mock)</div>
          <div className="flex h-16 items-end gap-0.5">
            {points.map((p) => (
              <div
                key={p.t + "c"}
                className="w-1.5 rounded-sm bg-cyan-700/80"
                style={{ height: `${Math.round((p.car / peakCar) * 100)}%` }}
                title={`${new Date(p.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${p.car}m`}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[10px] text-zinc-500">Pedestrian</div>
          <div className="flex h-16 items-end gap-0.5">
            {points.map((p) => (
              <div
                key={p.t + "p"}
                className="w-1.5 rounded-sm bg-amber-700/70"
                style={{ height: `${Math.round((p.pedestrian / peakPed) * 100)}%` }}
                title={`${new Date(p.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${
                  p.pedestrian
                }m`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 text-[10px] text-zinc-600">
        Future: align ticks to CBP publish cadence; overlay predicted trace from <span className="font-mono">/api/analytics</span>.
      </div>
    </DenseCard>
  );
}
