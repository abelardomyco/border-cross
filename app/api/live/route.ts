import { NextResponse } from "next/server";
import { buildRegionalOverview } from "@/lib/mock/mockLiveBuilder";

/**
 * GET /api/live
 * Future: authenticate + edge-cache; merge CBP connector output with CV + traffic fusion jobs.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const overview = buildRegionalOverview();
  return NextResponse.json(overview);
}
