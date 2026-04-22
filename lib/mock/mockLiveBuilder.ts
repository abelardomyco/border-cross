import portsSeed from "@/data/mock/ports-seed.json";
import { predictionService } from "@/lib/prediction";
import type {
  AnalyticsBundle,
  ApproachSegment,
  CameraFrame,
  CommercialSnapshot,
  HourlyCell,
  LaneWaitRow,
  LiveOutputMeta,
  OpsAlert,
  PortLayoutConfig,
  PortSnapshot,
  QueueEstimateRow,
  RegionalOverview,
  TrendPoint,
  VideoFlowSegment,
} from "@/lib/types/domain";
import type { LaneType } from "@/lib/types/domain";

type SeedPort = (typeof portsSeed)["ports"][number];

function rnd(maxDelta: number) {
  return (Math.random() * 2 - 1) * maxDelta;
}

function jitterInt(n: number, maxDelta: number) {
  return Math.max(0, Math.round(n + rnd(maxDelta)));
}

function isoMinutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function freshnessFromLag(sourceLagMinutes: number): LiveOutputMeta["freshness"] {
  if (sourceLagMinutes <= 3) return "live";
  if (sourceLagMinutes <= 10) return "recent";
  if (sourceLagMinutes <= 25) return "stale";
  return "unknown";
}

function makeLive(params: {
  confidence: number;
  sourceLagMinutes: number;
  primaryKind: LiveOutputMeta["sources"][number]["kind"];
  label: string;
}): LiveOutputMeta {
  const asOf = new Date().toISOString();
  const sourceTimestamp = isoMinutesAgo(params.sourceLagMinutes);
  return {
    asOf,
    sourceTimestamp,
    freshness: freshnessFromLag(params.sourceLagMinutes),
    confidence: params.confidence,
    sources: [
      {
        id: "primary",
        kind: params.primaryKind,
        label: params.label,
        observedAt: sourceTimestamp,
      },
      {
        id: "blend",
        kind: "model_blend",
        label: "Dashboard fusion (mock)",
        observedAt: asOf,
      },
    ],
  };
}

function trendSlope(car: number[]) {
  if (car.length < 2) return 0;
  return car[car.length - 1] - car[car.length - 2];
}

function buildTrend(car: number[], ped: number[]): TrendPoint[] {
  const now = Date.now();
  const stepMs = 15 * 60_000;
  return car.map((c, i) => {
    const t = new Date(now - (car.length - 1 - i) * stepMs).toISOString();
    return {
      t,
      car: jitterInt(c, 2),
      pedestrian: jitterInt(ped[i] ?? ped[ped.length - 1] ?? 0, 1),
    };
  });
}

function expandHourly(hourlyProfile: number[], dowBias: number[]): HourlyCell[] {
  const cells: HourlyCell[] = [];
  for (let dow = 0; dow < 7; dow++) {
    const bias = dowBias[dow] ?? 1;
    for (let hour = 0; hour < 24; hour++) {
      cells.push({
        hour,
        dow,
        intensity: Math.min(100, Math.round((hourlyProfile[hour] ?? 0) * bias)),
      });
    }
  }
  return cells;
}

function buildWaits(p: SeedPort): LaneWaitRow[] {
  const approachDelay = Math.max(...p.approach.map((a) => a.delay), 0);
  const carTrend = trendSlope(p.trendCar);
  const videoBottleneckScore = Math.round(
    p.approach.reduce((acc, a) => acc + a.congestion, 0) / Math.max(1, p.approach.length),
  );

  return p.baseWaits.map((w) => {
    const official = jitterInt(w.official, 3);
    const qp = p.queuePressure[w.laneType as keyof typeof p.queuePressure] ?? 50;
    const sourceLag = jitterInt(4, 2);
    const pred = predictionService.predict({
      portSlug: p.slug,
      laneType: w.laneType as LaneType,
      officialMinutes: official,
      trendSlope: w.laneType === "car" ? carTrend : carTrend * 0.35,
      approachDelayAddMinutes: w.laneType === "car" || w.laneType === "commercial" ? approachDelay : approachDelay * 0.4,
      queuePressure: qp,
      videoBottleneckScore:
        w.laneType === "car" || w.laneType === "commercial" ? videoBottleneckScore : Math.round(videoBottleneckScore * 0.6),
      sourceLagMinutes: sourceLag,
    });

    return {
      laneType: w.laneType as LaneType,
      label: w.label,
      officialMinutes: official,
      predictedTrueMinutes: pred.predictedTrueMinutes,
      openBooths: w.open,
      totalBooths: w.total,
      live: makeLive({
        confidence: pred.confidence,
        sourceLagMinutes: sourceLag,
        primaryKind: "cbp_official",
        label: "CBP Border Wait Times (mock connector)",
      }),
    };
  });
}

function buildQueue(p: SeedPort): QueueEstimateRow[] {
  return (Object.keys(p.queuePressure) as LaneType[]).map((laneType) => ({
    laneType,
    label: `${laneType} queue pressure`,
    pressure: jitterInt(p.queuePressure[laneType] ?? 50, 4),
    notes: [
      "CV density + lane occupancy fusion (mock)",
      "Screenshot evidence may adjust weight when present",
    ],
    evidenceKinds: ["camera_cv", "model_blend"] as const,
    live: makeLive({
      confidence: 0.55 + Math.random() * 0.2,
      sourceLagMinutes: jitterInt(2, 1),
      primaryKind: "camera_cv",
      label: "Camera / CV pipeline (mock)",
    }),
  }));
}

function buildApproach(p: SeedPort): ApproachSegment[] {
  return p.approach.map((a) => ({
    id: a.id,
    name: a.name,
    congestion: jitterInt(a.congestion, 5),
    delayAddMinutes: jitterInt(a.delay, 2),
    live: makeLive({
      confidence: 0.62 + Math.random() * 0.15,
      sourceLagMinutes: jitterInt(3, 2),
      primaryKind: "google_routes",
      label: "Google Routes traffic-aware (mock connector)",
    }),
  }));
}

function buildCameras(p: SeedPort): CameraFrame[] {
  return p.cameras.map((c) => ({
    id: c.id,
    title: c.title,
    imageUrl: `/mock-media/camera.svg?p=${encodeURIComponent(p.slug)}&c=${encodeURIComponent(c.id)}`,
    capturedAt: isoMinutesAgo(jitterInt(1, 1)),
    laneHint: c.laneHint as LaneType | undefined,
    live: makeLive({
      confidence: 0.48 + Math.random() * 0.2,
      sourceLagMinutes: jitterInt(1, 1),
      primaryKind: "camera_cv",
      label: "Municipal / operator camera snapshot (mock)",
    }),
  }));
}

function buildAlerts(p: SeedPort): OpsAlert[] {
  return p.alerts.map((a) => ({
    id: a.id,
    severity: a.severity as OpsAlert["severity"],
    title: a.title,
    body: a.body,
    validUntil: a.validUntil,
    live: makeLive({
      confidence: 0.9,
      sourceLagMinutes: jitterInt(6, 3),
      primaryKind: "crowd_signal",
      label: "Ops notices ingest (mock)",
    }),
  }));
}

function buildCommercial(p: SeedPort): CommercialSnapshot {
  const c = p.commercial;
  if (!c.enabled) {
    return {
      enabled: false,
      drayageDelayMinutes: null,
      openCommercialLanes: null,
      inspectionsPerHour: null,
      notes: c.notes,
      live: makeLive({
        confidence: 0.4,
        sourceLagMinutes: 30,
        primaryKind: "cbp_official",
        label: "Commercial lane not primary (mock)",
      }),
    };
  }
  return {
    enabled: true,
    drayageDelayMinutes: c.drayage != null ? jitterInt(c.drayage, 6) : null,
    openCommercialLanes: c.openLanes,
    inspectionsPerHour: c.iph,
    notes: c.notes,
    live: makeLive({
      confidence: 0.58 + Math.random() * 0.12,
      sourceLagMinutes: jitterInt(5, 2),
      primaryKind: "cbp_official",
      label: "CBP commercial lane summary (mock)",
    }),
  };
}

function buildVideoFlow(p: SeedPort): VideoFlowSegment[] {
  return p.approach.map((a) => {
    const baseFlow = 34 - (a.congestion / 100) * 18;
    const flow = Math.max(4, Math.round(baseFlow + rnd(4)));
    const bottleneck = Math.min(100, Math.max(0, Math.round(a.congestion + rnd(8))));
    const state: VideoFlowSegment["state"] =
      bottleneck > 88 ? "blocked" : bottleneck > 72 ? "stop_go" : bottleneck > 48 ? "dense" : "free";

    return {
      id: `vf-${a.id}`,
      name: `${a.name} · discharge`,
      flowRateVpm: flow,
      bottleneckScore: bottleneck,
      state,
      cameraId: `along-${a.id}`,
      live: makeLive({
        confidence: 0.56 + Math.random() * 0.18,
        sourceLagMinutes: jitterInt(2, 1),
        primaryKind: "camera_cv",
        label: "Along-approach video AI flow analysis (mock)",
      }),
    };
  });
}

export function getSeedPort(slug: string): SeedPort | undefined {
  return portsSeed.ports.find((p) => p.slug === slug);
}

export function buildPortSnapshot(slug: string): PortSnapshot | null {
  const p = getSeedPort(slug);
  if (!p) return null;

  const layout = p.layout as PortLayoutConfig;

  return {
    slug: p.slug,
    name: p.name,
    corridor: portsSeed.corridor,
    layout,
    waits: buildWaits(p),
    trend: buildTrend(p.trendCar, p.trendPed),
    cameras: buildCameras(p),
    queue: buildQueue(p),
    approach: buildApproach(p),
    videoFlow: buildVideoFlow(p),
    hourly: expandHourly(p.hourlyProfile, p.dowBias),
    bestWindows: p.bestWindows.map((b) => ({
      startLocal: b.startLocal,
      endLocal: b.endLocal,
      score: b.score,
      reason: b.reason,
    })),
    alerts: buildAlerts(p),
    commercial: buildCommercial(p),
  };
}

export function buildAllPortSnapshots(): PortSnapshot[] {
  return portsSeed.ports.map((p) => buildPortSnapshot(p.slug)!).filter(Boolean);
}

export function buildRegionalOverview(): RegionalOverview {
  const ports = portsSeed.ports.map((p) => {
    const snap = buildPortSnapshot(p.slug)!;
    const general = snap.waits.find((w) => w.laneType === "car");
    const sentri = snap.waits.find((w) => w.laneType === "sentri_ready");
    const ped = snap.waits.find((w) => w.laneType === "pedestrian");
    return {
      slug: p.slug,
      name: p.name,
      lanes: {
        general: {
          official: general?.officialMinutes ?? null,
          predicted: general?.predictedTrueMinutes ?? 0,
        },
        sentri_ready: sentri
          ? { official: sentri.officialMinutes ?? null, predicted: sentri.predictedTrueMinutes }
          : null,
        pedestrian: ped ? { official: ped.officialMinutes ?? null, predicted: ped.predictedTrueMinutes } : null,
      },
      freshness: general?.live.freshness ?? "unknown",
      confidence: general?.live.confidence ?? 0,
      sourceTimestamp: general?.live.sourceTimestamp ?? new Date().toISOString(),
    };
  });

  const regionalAlerts: OpsAlert[] = [
    {
      id: "reg-mock",
      severity: "info",
      title: "Regional notice (mock)",
      body: "This dashboard uses synthetic data. Connectors for CBP, cameras, and traffic are stubbed in API routes.",
      validUntil: undefined,
      live: makeLive({
        confidence: 1,
        sourceLagMinutes: 0,
        primaryKind: "model_blend",
        label: "System",
      }),
    },
  ];

  return {
    generatedAt: new Date().toISOString(),
    corridor: portsSeed.corridor,
    ports,
    regionalAlerts,
  };
}

export function buildAnalyticsBundle(slug: string | "all"): AnalyticsBundle {
  const series: AnalyticsBundle["series"] = [];
  let t0 = Date.now() - 1000 * 60 * 60 * 36;
  for (let i = 0; i < 36; i++) {
    t0 += 60 * 60_000;
    const wave = 55 + Math.sin(i / 4) * 18 + rnd(6);
    series.push({
      t: new Date(t0).toISOString(),
      officialCar: Math.max(10, Math.round(wave + rnd(4))),
      predictedCar: Math.max(12, Math.round(wave * 1.08 + rnd(5))),
    });
  }

  const dwellHistogram = Array.from({ length: 12 }, () => Math.round(10 + Math.random() * 40));

  return {
    generatedAt: new Date().toISOString(),
    slug,
    series,
    dwellHistogram,
  };
}
