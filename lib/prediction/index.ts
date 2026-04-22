import type { TrueWaitPredictionService } from "./types";
import { mockPredictTrueWait } from "./mockFormulas";

export type { TrueWaitPredictionInput, TrueWaitPredictionOutput, TrueWaitPredictionService } from "./types";
export { mockPredictTrueWait } from "./mockFormulas";

/** Swap implementation when wiring a real model service (edge function / Python sidecar). */
export const predictionService: TrueWaitPredictionService = {
  predict: mockPredictTrueWait,
};
