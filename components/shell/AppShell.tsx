import Link from "next/link";
import type { ReactNode } from "react";
import { AtmosphereOverlay } from "@/components/ui/AtmosphereOverlay";
import type { LightingPhase } from "@/lib/ui/portLighting";

type HeaderTone = {
  from: string;
  to: string;
  accent: string;
  phase?: LightingPhase;
};

const nav = [
  { href: "/", label: "Regional" },
  { href: "/ports/san-ysidro", label: "San Ysidro" },
  { href: "/ports/otay-mesa", label: "Otay Mesa" },
  { href: "/ports/tecate", label: "Tecate" },
  { href: "/ports/calexico-west", label: "Calexico W" },
  { href: "/ports/calexico-east", label: "Calexico E" },
  { href: "/quick-check", label: "Quick check" },
  { href: "/analytics", label: "Analytics" },
  { href: "/admin", label: "Admin" },
];

export function AppShell({
  title,
  subtitle,
  right,
  headerTone,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  headerTone?: HeaderTone;
  children: ReactNode;
}) {
  const headerStyle: React.CSSProperties | undefined = headerTone
    ? {
        background: `linear-gradient(180deg, ${headerTone.from} 0%, ${headerTone.to} 100%)`,
        borderColor: `${headerTone.accent}55`,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-surface-1/95 backdrop-blur" style={headerStyle}>
        {headerTone?.phase ? (
          <div className="relative">
            <AtmosphereOverlay phase={headerTone.phase} accent={headerTone.accent} />
          </div>
        ) : null}
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-3 py-2 sm:px-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <div
                className="text-[10px] font-mono uppercase tracking-[0.2em]"
                style={{ color: headerTone?.accent ?? "var(--accent-teal)" }}
              >
                Border Ops Dashboard
              </div>
              <h1 className="text-sm font-semibold leading-tight text-zinc-50 sm:text-base">{title}</h1>
              {subtitle ? <p className="text-[11px] text-zinc-500">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-2">{right}</div>
          </div>
          <nav className="flex flex-wrap gap-1 text-[11px]">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded border border-border bg-surface-2/70 px-2 py-1 text-zinc-300 hover:border-ops-teal/40 hover:text-ops-teal"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-3 py-3 sm:px-4 sm:py-4">{children}</main>
    </div>
  );
}
