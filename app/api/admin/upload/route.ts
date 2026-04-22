import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/upload
 * Accepts multipart form: file (optional), portSlug, laneType, capturedAt (ISO)
 *
 * Future: push to object storage + enqueue CV job; write provenance row in DB.
 */
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const portSlug = String(form.get("portSlug") ?? "");
    const laneType = String(form.get("laneType") ?? "");
    const capturedAt = String(form.get("capturedAt") ?? new Date().toISOString());
    const notes = String(form.get("notes") ?? "");
    const file = form.get("file");

    let fileName: string | null = null;
    let bytes = 0;
    if (file instanceof File) {
      fileName = file.name;
      bytes = file.size;
    }

    const id = crypto.randomUUID();
    return NextResponse.json({
      ok: true,
      id,
      mapped: { portSlug, laneType, capturedAt, notes, fileName, bytes },
      message:
        "Mock ingest only — wire to storage + CV queue pipeline. See lib/integrations/sourceAdapters.notes.ts",
    });
  }

  const body = (await req.json().catch(() => null)) as null | Record<string, unknown>;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    id: crypto.randomUUID(),
    mapped: body,
    message: "JSON payload recorded (mock) — prefer multipart for real screenshots.",
  });
}
