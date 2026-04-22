"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { DenseCard } from "@/components/modules/DenseCard";

type LaneType = "car" | "pedestrian" | "sentri_ready" | "commercial";

type StoredUpload = {
  id: string;
  createdAt: string;
  portSlug: string;
  laneType: LaneType;
  capturedAt: string;
  notes: string;
  fileName: string | null;
  bytes: number;
  server: unknown;
};

const STORAGE_KEY = "bcd-admin-uploads-v1";

const PORTS = [
  { slug: "san-ysidro", name: "San Ysidro" },
  { slug: "otay-mesa", name: "Otay Mesa" },
  { slug: "tecate", name: "Tecate" },
  { slug: "calexico-west", name: "Calexico West" },
  { slug: "calexico-east", name: "Calexico East" },
] as const;

export default function AdminPage() {
  const [items, setItems] = useState<StoredUpload[]>([]);
  const [portSlug, setPortSlug] = useState<string>(PORTS[0].slug);
  const [laneType, setLaneType] = useState<LaneType>("car");
  const [capturedAt, setCapturedAt] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      setItems(JSON.parse(raw) as StoredUpload[]);
    } catch {
      // ignore
    }
  }, []);

  const prettyItems = useMemo(() => items.slice().reverse(), [items]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.set("portSlug", portSlug);
      fd.set("laneType", laneType);
      fd.set("capturedAt", new Date(capturedAt).toISOString());
      fd.set("notes", notes);
      if (file) fd.set("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { ok?: boolean; id?: string; mapped?: unknown; message?: string; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Upload failed");

      const row: StoredUpload = {
        id: String(json.id ?? crypto.randomUUID()),
        createdAt: new Date().toISOString(),
        portSlug,
        laneType,
        capturedAt: new Date(capturedAt).toISOString(),
        notes,
        fileName: file?.name ?? null,
        bytes: file?.size ?? 0,
        server: json,
      };

      const next = [row, ...items];
      setItems(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setMsg(json.message ?? "Mapped ingest (mock).");
      setFile(null);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell
      title="Admin / data ingestion"
      subtitle="Screenshots + camera snapshots + manual notes — mock API persists mapping metadata locally"
    >
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <DenseCard title="Uploader (maps evidence → port + lane + timestamp)">
          <form className="space-y-2" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="space-y-1">
                <div className="text-[10px] text-zinc-500">Port</div>
                <select
                  value={portSlug}
                  onChange={(e) => setPortSlug(e.target.value)}
                  className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px]"
                >
                  {PORTS.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <div className="text-[10px] text-zinc-500">Lane type</div>
                <select
                  value={laneType}
                  onChange={(e) => setLaneType(e.target.value as LaneType)}
                  className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px]"
                >
                  <option value="car">car</option>
                  <option value="pedestrian">pedestrian</option>
                  <option value="sentri_ready">sentri_ready</option>
                  <option value="commercial">commercial</option>
                </select>
              </label>
            </div>

            <label className="space-y-1">
              <div className="text-[10px] text-zinc-500">Evidence timestamp (local input → stored ISO)</div>
              <input
                type="datetime-local"
                value={capturedAt}
                onChange={(e) => setCapturedAt(e.target.value)}
                className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px]"
              />
            </label>

            <label className="space-y-1">
              <div className="text-[10px] text-zinc-500">Manual notes</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[11px]"
                placeholder="Queue tail visible, left-most lanes stalled, etc."
              />
            </label>

            <label className="space-y-1">
              <div className="text-[10px] text-zinc-500">Screenshot / snapshot file (optional)</div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-[11px] text-zinc-300"
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded border border-cyan-900/60 bg-cyan-950/30 py-2 text-[12px] font-semibold text-cyan-100 disabled:opacity-50"
            >
              {busy ? "Uploading…" : "Submit ingest (mock)"}
            </button>

            {msg ? <div className="text-[11px] text-zinc-400">{msg}</div> : null}

            <div className="text-[10px] text-zinc-600">
              Future: store blob → object storage, enqueue CV detector, attach provenance to `QueueEstimateRow` fusion.
            </div>
          </form>
        </DenseCard>

        <DenseCard title="Recent mapped ingests (local)">
          {prettyItems.length ? (
            <div className="max-h-[520px] space-y-2 overflow-auto pr-1">
              {prettyItems.map((u) => (
                <div key={u.id} className="rounded border border-zinc-800/80 bg-black/25 p-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-mono text-[10px] text-zinc-500">{u.id}</div>
                    <div className="font-mono text-[10px] text-zinc-400">{new Date(u.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-200">
                    <span className="font-mono text-cyan-300">{u.portSlug}</span> ·{" "}
                    <span className="font-mono text-amber-200">{u.laneType}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-zinc-500">
                    evidence time <span className="font-mono text-zinc-300">{new Date(u.capturedAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-zinc-500">
                    file {u.fileName ?? "—"} {u.bytes ? <span className="text-zinc-400">({u.bytes} bytes)</span> : null}
                  </div>
                  {u.notes ? <div className="mt-1 whitespace-pre-wrap text-[11px] text-zinc-300">{u.notes}</div> : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-zinc-500">No local ingests yet.</div>
          )}
        </DenseCard>
      </div>
    </AppShell>
  );
}
