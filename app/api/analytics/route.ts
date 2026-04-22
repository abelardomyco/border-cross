import { NextResponse } from "next/server";
import { buildAnalyticsBundle } from "@/lib/mock/mockLiveBuilder";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "all";
  const bundle = buildAnalyticsBundle(slug === "all" ? "all" : slug);
  return NextResponse.json(bundle);
}
