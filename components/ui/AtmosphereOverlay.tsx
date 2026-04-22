import type { LightingPhase } from "@/lib/ui/portLighting";

type Variant = "clouds" | "stars" | "mixed";

function variantForPhase(phase: LightingPhase): Variant {
  if (phase === "night" || phase === "predawn" || phase === "dawn") return "stars";
  if (phase === "evening" || phase === "sunset" || phase === "sunrise") return "mixed";
  return "clouds";
}

function Clouds({ opacity = 0.22 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 300"
      className="absolute inset-x-0 top-0 h-24 w-full"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="b" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <path
        d="M0,160 C120,120 220,190 340,150 C460,110 560,180 700,140 C840,100 980,160 1200,120 L1200,0 L0,0 Z"
        fill="url(#c)"
        filter="url(#b)"
      />
      <path
        d="M0,220 C140,170 280,250 420,200 C560,150 700,240 860,190 C1020,140 1100,220 1200,180 L1200,0 L0,0 Z"
        fill="rgba(255,255,255,0.12)"
        filter="url(#b)"
      />
    </svg>
  );
}

function Stars({ opacity = 0.25 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 300"
      className="absolute inset-x-0 top-0 h-24 w-full"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="s" cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {[
        [80, 40, 4],
        [220, 70, 3],
        [340, 28, 2],
        [520, 60, 3],
        [640, 32, 2],
        [760, 80, 4],
        [920, 48, 3],
        [1040, 26, 2],
        [1120, 66, 3],
      ].map(([x, y, r], idx) => (
        <circle key={idx} cx={x} cy={y} r={r} fill="url(#s)" />
      ))}
    </svg>
  );
}

export function AtmosphereOverlay({
  phase,
  accent,
}: {
  phase: LightingPhase;
  accent: string;
}) {
  const v = variantForPhase(phase);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
      {/* subtle tint wash to blend overlay with palette */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${accent}18 0%, transparent 55%)` }} />
      {v === "clouds" ? <Clouds /> : null}
      {v === "stars" ? <Stars /> : null}
      {v === "mixed" ? (
        <>
          <Clouds opacity={0.16} />
          <Stars opacity={0.18} />
        </>
      ) : null}
    </div>
  );
}

