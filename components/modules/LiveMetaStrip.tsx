import type { LiveOutputMeta } from "@/lib/types/domain";

function fmt(iso: string) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`;
  } catch {
    return iso;
  }
}

function freshnessClass(f: LiveOutputMeta["freshness"]) {
  if (f === "live") return "text-emerald-300";
  if (f === "recent") return "text-amber-300";
  if (f === "stale") return "text-rose-300";
  return "text-zinc-500";
}

export function LiveMetaStrip({ meta, dense }: { meta: LiveOutputMeta; dense?: boolean }) {
  return (
    <div
      className={`flex flex-wrap gap-x-2 gap-y-0.5 font-mono text-zinc-500 ${dense ? "text-[9px]" : "text-[10px]"}`}
      title={meta.sources.map((s) => `${s.label} (${s.kind})`).join(" · ")}
    >
      <span>
        Assembled <span className="text-zinc-300">{fmt(meta.asOf)}</span>
      </span>
      <span>
        Source <span className="text-zinc-300">{fmt(meta.sourceTimestamp)}</span>
      </span>
      <span className={freshnessClass(meta.freshness)}>{meta.freshness.toUpperCase()}</span>
      <span>
        Conf <span className="text-zinc-200">{(meta.confidence * 100).toFixed(0)}%</span>
      </span>
    </div>
  );
}
