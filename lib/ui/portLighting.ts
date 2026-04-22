export type LightingPhase =
  | "night"
  | "predawn"
  | "dawn"
  | "sunrise"
  | "morning"
  | "noon"
  | "afternoon"
  | "sunset"
  | "evening";

export type LightingPalette = {
  phase: LightingPhase;
  /** tile/header gradient top */
  from: string;
  /** tile/header gradient bottom */
  to: string;
  /** accent used for border/chevron */
  accent: string;
  /** human label: weather-app style conditions */
  conditions: string;
};

export type WaitSeverity = "good" | "caution" | "warning" | "critical" | "unknown";

export function waitSeverity(minutes: number | null | undefined): WaitSeverity {
  if (minutes == null) return "unknown";
  if (minutes < 30) return "good";
  if (minutes < 60) return "caution";
  if (minutes < 90) return "warning";
  return "critical";
}

export function waitSeverityTextClass(sev: WaitSeverity) {
  switch (sev) {
    case "good":
      return "text-green-400";
    case "caution":
      return "text-amber-300";
    case "warning":
      return "text-orange-300";
    case "critical":
      return "text-rose-300";
    default:
      return "text-zinc-500";
  }
}

/**
 * Determine local hour for a given IANA timeZone without relying on system TZ.
 * (Keeps “synced per region” behavior even if viewer is elsewhere.)
 */
export function hourInTimeZone(timeZone: string, now = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hourStr = parts.find((p) => p.type === "hour")?.value ?? "00";
  return Number.parseInt(hourStr, 10) || 0;
}

/**
 * Time/lighting palette rules.
 * This is a deliberate “ops dashboard” stylization, not an astronomical sunrise model.
 *
 * Spec mapping:
 * - Noon: sky blues + yellows
 * - Toward sunset: more yellow → orange → red
 * - After: amethyst → deep purple → night navy
 * - Morning: reverse, but “red turns green/yellow when the sun comes out”
 */
export function lightingPaletteForHour(hour: number): LightingPalette {
  // Night (deep navy; matches existing UI night tone)
  if (hour >= 20 || hour < 4) {
    return { phase: "night", from: "#070a0f", to: "#0b1220", accent: "#22c1b3", conditions: "Clear · stars" };
  }

  // Predawn → Dawn (deep purple → amethyst)
  if (hour < 6) {
    return { phase: "predawn", from: "#120a24", to: "#1b1233", accent: "#8b5cf6", conditions: "Clear · pre-dawn" };
  }
  if (hour < 7) {
    return { phase: "dawn", from: "#24104d", to: "#120a24", accent: "#a78bfa", conditions: "Thin haze · dawn" };
  }

  // Sunrise (brief red, then transitions to “sun out” greens/yellows)
  if (hour < 8) {
    return { phase: "sunrise", from: "#3b0a12", to: "#24104d", accent: "#fb7185", conditions: "Sunrise · glare" };
  }

  // Morning (green/yellow emergence)
  if (hour < 10) {
    return { phase: "morning", from: "#0b2a1c", to: "#0b1220", accent: "#22c55e", conditions: "Morning sun" };
  }

  // Noon (sky blue + yellow)
  if (hour < 14) {
    return { phase: "noon", from: "#0b1a3a", to: "#0b1220", accent: "#60a5fa", conditions: "Bright · high sun" };
  }

  // Afternoon (yellow → orange)
  if (hour < 17) {
    return { phase: "afternoon", from: "#2a1b07", to: "#0b1220", accent: "#f5c451", conditions: "Warm light" };
  }

  // Sunset (orange → red)
  if (hour < 19) {
    return { phase: "sunset", from: "#3a1407", to: "#120a24", accent: "#fb923c", conditions: "Sunset · low angle" };
  }

  // Evening (red → amethyst → deep purple)
  return { phase: "evening", from: "#2a0b18", to: "#120a24", accent: "#a78bfa", conditions: "Evening · cooling" };
}

export function lightingPaletteForTimeZone(timeZone: string, now = new Date()): LightingPalette {
  return lightingPaletteForHour(hourInTimeZone(timeZone, now));
}

