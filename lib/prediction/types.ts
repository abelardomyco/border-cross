import type { LaneType } from "@/lib/types/domain";

/** Inputs a future live stack will populate from CBP + CV + traffic fusion */
export interface TrueWaitPredictionInput {
  portSlug: string;
  laneType: LaneType;
  officialMinutes: number | null;
  /** Recent slope of official car wait (minutes per 15m), mock-only for now */
  trendSlope: number;
  approachDelayAddMinutes: number;
  queuePressure: number;
  /**
   * Video AI discharge / flow signal (0–100). Higher = worse flow / lower discharge.
   * Future: derived from along-approach camera CV (vehicle tracking, headway, stop-go).
   */
  videoBottleneckScore: number;
  /** Minutes since primary source timestamp */
  sourceLagMinutes: number;
}

export interface TrueWaitPredictionOutput {
  predictedTrueMinutes: number;
  confidence: number;
  rationaleCodes: string[];
}

export interface TrueWaitPredictionService {
  predict(input: TrueWaitPredictionInput): TrueWaitPredictionOutput;
}
