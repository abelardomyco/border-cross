"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface RefreshState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  lastFetchAt: string | null;
  tick: number;
}

const DEFAULT_MS = 30_000;

export function useDashboardRefresh<T>(url: string, intervalMs: number = DEFAULT_MS) {
  const [state, setState] = useState<RefreshState<T>>({
    data: null,
    error: null,
    loading: true,
    lastFetchAt: null,
    tick: 0,
  });
  const mounted = useRef(true);

  const fetchOnce = useCallback(async () => {
    setState((s) => ({ ...s, loading: s.data == null, error: null }));
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = (await res.json()) as T;
      if (!mounted.current) return;
      setState({
        data: json,
        error: null,
        loading: false,
        lastFetchAt: new Date().toISOString(),
        tick: Date.now(),
      });
    } catch (e) {
      if (!mounted.current) return;
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : "Fetch failed",
      }));
    }
  }, [url]);

  useEffect(() => {
    mounted.current = true;
    void fetchOnce();
    const id = window.setInterval(() => void fetchOnce(), intervalMs);
    return () => {
      mounted.current = false;
      window.clearInterval(id);
    };
  }, [fetchOnce, intervalMs]);

  return { ...state, refetch: fetchOnce };
}
