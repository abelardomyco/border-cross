/**
 * INTEGRATION MAP (implementations live outside this mock dashboard)
 *
 * CBP / official waits
 * - Replace `GET /api/live` seed assembly with a worker that pulls CBP Border Wait Times
 *   JSON/HTML (where permitted) and normalizes to `LaneWaitRow.officialMinutes`.
 * - Preserve `sourceTimestamp` from the upstream payload; set `freshness` from clock skew rules.
 *
 * Google Routes / approach congestion
 * - Poll Directions API + Routes API (traffic-aware) along I-5 / SR-905 / SR-11 approach polylines.
 * - Map duration_in_traffic vs baseline freeflow into `ApproachSegment.delayAddMinutes`.
 * - Attribute `EvidenceSource.kind = "google_routes"`.
 *
 * Cameras + CV queue estimation
 * - Ingest fixed camera RTSP/snapshots → object detection / occupancy CV pipeline.
 * - Emit `QueueEstimateRow.pressure` and optional `CameraFrame.imageUrl` with signed URLs.
 * - Treat admin-uploaded screenshots as weak-signal evidence (`screenshot_manual`) until CV scores exist.
 *
 * Video camera AI flow analysis (along approach / discharge)
 * - Run vehicle tracking and motion flow on along-road segments leading to the port.
 * - Emit `VideoFlowSegment.flowRateVpm`, `bottleneckScore`, `state` and attach camera provenance.
 * - Feed `bottleneckScore` (or per-lane discharge) into the prediction blend to better estimate true crossing time,
 *   especially when official wait is stale or under-reporting stop-go waves.
 *
 * Future cross-border ports
 * - Add a row to `data/mock/ports-seed.json` (or DB) and a `PortLayoutConfig` variant.
 * - Reuse module renderer; only layout + lane availability differ per crossing behavior.
 */

export const INTEGRATION_NOTES_VERSION = "2026-04-20";
