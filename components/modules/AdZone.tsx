import { DenseCard } from "./DenseCard";

export function AdZone({ slot }: { slot: "rail" | "footer" }) {
  return (
    <DenseCard title={slot === "rail" ? "Sponsored rail" : "Sponsored footer"}>
      <div className="rounded border border-dashed border-zinc-800 bg-zinc-950/40 p-3 text-[10px] text-zinc-600">
        Non-interruptive placement. Keep height bounded; never displace live wait/prediction modules on mobile.
        <div className="mt-2 h-16 rounded bg-zinc-900/60" />
      </div>
    </DenseCard>
  );
}
