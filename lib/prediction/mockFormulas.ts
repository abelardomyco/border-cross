import type { TrueWaitPredictionInput, TrueWaitPredictionOutput } from "./types";

/**
 * MOCK prediction only — replace with trained model + calibrated blend.
 * Future: ingest camera queue length, Google Routes delay on approach polylines,
 * and CBP official series; output posterior mean + credible interval.
 */
export function mockPredictTrueWait(
  input: TrueWaitPredictionInput,
): TrueWaitPredictionOutput {
  const base =
    input.officialMinutes ??
    (input.laneType === "pedestrian" ? 35 : input.laneType === "sentri_ready" ? 12 : 55);

  const lagInflation = Math.min(22, input.sourceLagMinutes * 0.35);
  const trendInflation = Math.max(-8, input.trendSlope * 0.6);
  const queueInflation = (input.queuePressure / 100) * 18;
  const approach = Math.max(0, input.approachDelayAddMinutes);
  const flowInflation = (Math.min(100, Math.max(0, input.videoBottleneckScore)) / 100) * 16;

  let laneFactor = 1;
  if (input.laneType === "sentri_ready") laneFactor = 0.55;
  if (input.laneType === "pedestrian") laneFactor = 0.85;
  if (input.laneType === "commercial") laneFactor = 1.25;

  const predicted = Math.round(
    Math.max(5, (base + lagInflation + trendInflation + queueInflation + approach + flowInflation) * laneFactor),
  );

  const confidence = Math.max(
    0.35,
    Math.min(
      0.92,
      0.78 - input.sourceLagMinutes * 0.004 + (input.officialMinutes != null ? 0.08 : -0.12),
    ),
  );

  return {
    predictedTrueMinutes: predicted,
    confidence,
    rationaleCodes: [
      "MOCK_BLEND_OFFICIAL_LAG",
      input.videoBottleneckScore > 70 ? "VIDEO_FLOW_BOTTLENECK_HIGH" : "VIDEO_FLOW_OK",
      input.officialMinutes == null ? "MISSING_OFFICIAL_FALLBACK" : "HAS_OFFICIAL",
      input.queuePressure > 70 ? "HIGH_QUEUE_PRESSURE" : "QUEUE_MODERATE",
    ],
  };
}
