/**
 * Core domain types for the border operations dashboard.
 * Live connectors (CBP wait feeds, cameras, traffic) normalize into these shapes.
 */

export type LaneType = "car" | "pedestrian" | "sentri_ready" | "commercial";

export type FreshnessLabel = "live" | "recent" | "stale" | "unknown";

export type EvidenceKind =
  | "cbp_official"
  | "camera_cv"
  | "screenshot_manual"
  | "google_routes"
  | "crowd_signal"
  | "model_blend";

export interface EvidenceSource {
  id: string;
  kind: EvidenceKind;
  label: string;
  observedAt: string;
}

/** Attached to every live-derived metric shown in the UI */
export interface LiveOutputMeta {
  /** When this dashboard row was assembled */
  asOf: string;
  /** Timestamp from the primary upstream source (e.g. CBP JSON `last_updated`) */
  sourceTimestamp: string;
  freshness: FreshnessLabel;
  /** 0–1 blended certainty from source agreement + recency */
  confidence: number;
  sources: EvidenceSource[];
}

export interface LaneWaitRow {
  laneType: LaneType;
  label: string;
  officialMinutes: number | null;
  predictedTrueMinutes: number;
  openBooths: number | null;
  totalBooths: number | null;
  live: LiveOutputMeta;
}

export interface TrendPoint {
  t: string;
  car: number;
  pedestrian: number;
  sentri_ready?: number;
}

export interface CameraFrame {
  id: string;
  title: string;
  /** Placeholder or future CDN URL */
  imageUrl: string;
  capturedAt: string;
  laneHint?: LaneType;
  live: LiveOutputMeta;
}

export interface QueueEstimateRow {
  laneType: LaneType;
  label: string;
  /** Relative queue pressure 0–100 */
  pressure: number;
  notes: string[];
  evidenceKinds: EvidenceKind[];
  live: LiveOutputMeta;
}

export interface ApproachSegment {
  id: string;
  name: string;
  /** 0 = free flow … 100 = severe */
  congestion: number;
  delayAddMinutes: number;
  live: LiveOutputMeta;
}

export interface VideoFlowSegment {
  id: string;
  name: string;
  /** vehicles/min (approx) — future: per-lane-class */
  flowRateVpm: number;
  /** 0–100; higher means near-capacity / low discharge */
  bottleneckScore: number;
  /** qualitative state from CV */
  state: "free" | "dense" | "stop_go" | "blocked";
  /** primary evidence (camera ID, along-road camera, etc.) */
  cameraId: string;
  live: LiveOutputMeta;
}

export interface HourlyCell {
  hour: number;
  dow: number;
  intensity: number;
}

export interface BestWindow {
  startLocal: string;
  endLocal: string;
  score: number;
  reason: string;
}

export interface OpsAlert {
  id: string;
  severity: "info" | "warn" | "critical";
  title: string;
  body: string;
  validUntil?: string;
  live: LiveOutputMeta;
}

export interface CommercialSnapshot {
  enabled: boolean;
  drayageDelayMinutes: number | null;
  openCommercialLanes: number | null;
  inspectionsPerHour: number | null;
  notes: string;
  live: LiveOutputMeta;
}

export type DashboardModuleId =
  | "alerts"
  | "official_wait"
  | "predicted_wait"
  | "open_lanes"
  | "trend"
  | "heatmap"
  | "best_time"
  | "queue"
  | "approach"
  | "video_flow"
  | "cameras"
  | "commercial"
  | "ads_rail"
  | "ads_footer";

export interface PortLayoutConfig {
  variant: string;
  moduleOrder: DashboardModuleId[];
  /** Lane types this port exposes in the UI */
  laneTypes: LaneType[];
}

export interface PortSnapshot {
  slug: string;
  name: string;
  corridor: string;
  layout: PortLayoutConfig;
  waits: LaneWaitRow[];
  trend: TrendPoint[];
  cameras: CameraFrame[];
  queue: QueueEstimateRow[];
  approach: ApproachSegment[];
  videoFlow: VideoFlowSegment[];
  hourly: HourlyCell[];
  bestWindows: BestWindow[];
  alerts: OpsAlert[];
  commercial: CommercialSnapshot;
}

export interface RegionalOverview {
  generatedAt: string;
  corridor: string;
  ports: Array<{
    slug: string;
    name: string;
    lanes: {
      general: { official: number | null; predicted: number };
      sentri_ready: { official: number | null; predicted: number } | null;
      pedestrian: { official: number | null; predicted: number } | null;
    };
    freshness: FreshnessLabel;
    confidence: number;
    sourceTimestamp: string;
  }>;
  regionalAlerts: OpsAlert[];
}

export interface AnalyticsBundle {
  generatedAt: string;
  slug: string | "all";
  series: Array<{ t: string; officialCar: number; predictedCar: number }>;
  dwellHistogram: number[];
}
