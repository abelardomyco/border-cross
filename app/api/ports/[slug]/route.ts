import { NextResponse } from "next/server";
import { buildPortSnapshot } from "@/lib/mock/mockLiveBuilder";

export const dynamic = "force-dynamic";

export async function GET(_: Request, ctx: { params: { slug: string } }) {
  const snap = buildPortSnapshot(ctx.params.slug);
  if (!snap) {
    return NextResponse.json({ error: "Unknown port" }, { status: 404 });
  }
  return NextResponse.json(snap);
}
