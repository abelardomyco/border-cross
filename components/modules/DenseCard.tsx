import type { ReactNode } from "react";

export function DenseCard({
  title,
  right,
  children,
  className = "",
}: {
  title: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-md border border-border bg-gradient-to-b from-surface-2/80 to-surface-1/80 p-2 shadow-sm shadow-black/30 ${className}`}
    >
      <header className="mb-1.5 flex items-center justify-between gap-2 border-b border-zinc-800/70 pb-1">
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{title}</h2>
        {right}
      </header>
      <div className="text-[11px] leading-snug text-zinc-200">{children}</div>
    </section>
  );
}
