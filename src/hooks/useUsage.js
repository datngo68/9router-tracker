import { useEffect, useRef, useState } from "react";
import { fetchUsage, ApiError } from "../lib/api.js";

// Polls /api/public/key-usage every `intervalMs`. Stops permanently on 401
// (no point hammering the server with a bad key) and exposes a manual
// `refresh()` trigger for UI buttons.

const DEFAULT_INTERVAL = 5000;

export function useUsage({ baseUrl, apiKey, intervalMs = DEFAULT_INTERVAL, enabled = true }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const stoppedRef = useRef(false);
  const abortRef = useRef(null);
  const tickRef = useRef(0);

  async function load() {
    if (!enabled || stoppedRef.current) return;
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    try {
      const json = await fetchUsage({ baseUrl, apiKey, signal: ctrl.signal });
      setData(json);
      setError(null);
      setLastUpdated(new Date());
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError(e instanceof ApiError ? e : new ApiError(e?.message || "Lỗi không xác định", "unknown"));
      // Stop polling on auth errors — the key isn't going to magically become valid.
      if (e instanceof ApiError && e.kind === "auth") {
        stoppedRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    stoppedRef.current = false;
    setData(null);
    setError(null);
    setLastUpdated(null);
    if (!enabled || !apiKey || !baseUrl) return undefined;

    let cancelled = false;
    load();
    const id = setInterval(() => {
      if (cancelled || stoppedRef.current) return;
      tickRef.current += 1;
      load();
    }, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, apiKey, intervalMs, enabled]);

  return {
    data,
    error,
    loading,
    lastUpdated,
    stopped: stoppedRef.current,
    refresh: () => {
      stoppedRef.current = false;
      load();
    },
  };
}
