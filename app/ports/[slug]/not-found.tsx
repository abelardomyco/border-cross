import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";

export default function NotFound() {
  return (
    <AppShell title="Unknown port" subtitle="This slug is not in the initial SD–TJ roster.">
      <div className="rounded border border-zinc-800 bg-zinc-950/40 p-4 text-[12px] text-zinc-300">
        Use a known port route, or add a new port row in{" "}
        <span className="font-mono text-zinc-100">data/mock/ports-seed.json</span> plus a layout template.
      </div>
      <Link href="/" className="mt-3 inline-block text-[12px] text-cyan-300 underline">
        ← Regional overview
      </Link>
    </AppShell>
  );
}
