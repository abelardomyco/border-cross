import type { OpsAlert } from "@/lib/types/domain";
import { DenseCard } from "./DenseCard";
import { LiveMetaStrip } from "./LiveMetaStrip";

function sevClass(s: OpsAlert["severity"]) {
  if (s === "critical") return "border-rose-900/70 bg-rose-950/30";
  if (s === "warn") return "border-amber-900/60 bg-amber-950/20";
  return "border-zinc-800/70 bg-black/20";
}

export function AlertsPanel({ alerts }: { alerts: OpsAlert[] }) {
  if (!alerts.length) {
    return (
      <DenseCard title="Alerts / notices">
        <div className="text-[11px] text-zinc-500">No active notices for this slice (mock).</div>
      </DenseCard>
    );
  }

  return (
    <DenseCard title="Alerts / notices">
      <div className="space-y-2">
        {alerts.map((a) => (
          <div key={a.id} className={`rounded border p-1.5 ${sevClass(a.severity)}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono uppercase text-zinc-500">{a.severity}</div>
                <div className="text-[12px] font-semibold text-zinc-100">{a.title}</div>
              </div>
            </div>
            <div className="mt-1 text-[11px] text-zinc-300">{a.body}</div>
            {a.validUntil ? (
              <div className="mt-1 text-[10px] text-zinc-500">
                Valid until{" "}
                <span className="font-mono text-zinc-300">{new Date(a.validUntil).toLocaleString()}</span>
              </div>
            ) : null}
            <div className="mt-2">
              <LiveMetaStrip meta={a.live} dense />
            </div>
          </div>
        ))}
      </div>
    </DenseCard>
  );
}
