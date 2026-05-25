import { useEffect, useRef, useState } from "react";
import { fmtAgo, fmtUsd, estimateUsd, fmtTokens } from "../lib/format.js";

// LiveActivity tracks the *latest* request's timestamp. Each time the parent
// re-fetches and a row appears with a newer timestamp than what we've seen,
// we prepend it to the list (capped at MAX_ITEMS) so users get a real-time
// feed even though the upstream API is poll-based.
const MAX_ITEMS = 8;

export default function LiveActivity({ recent, paused }) {
  const [items, setItems] = useState([]);
  const lastSeenRef = useRef(0);
  // Tick every second so relative timestamps stay fresh.
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!recent || recent.length === 0) return;
    // recent is ordered newest-first; collect anything strictly newer than lastSeen.
    const fresh = [];
    for (const r of recent) {
      const t = new Date(r.timestamp).getTime();
      if (Number.isNaN(t)) continue;
      if (t <= lastSeenRef.current) break;
      fresh.push(r);
    }
    if (fresh.length === 0) return;
    lastSeenRef.current = new Date(fresh[0].timestamp).getTime();
    setItems((prev) => [...fresh, ...prev].slice(0, MAX_ITEMS));
  }, [recent]);

  return (
    <aside className="rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2">
            {!paused && (
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
            )}
            <span
              className={`relative inline-block h-2 w-2 rounded-full ${
                paused ? "bg-muted" : "bg-emerald-500"
              }`}
            />
          </span>
          <h2 className="text-[11px] font-semibold uppercase tracking-wider">
            Live activity
          </h2>
        </div>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center text-xs text-muted">
          <svg
            viewBox="0 0 24 24"
            className="mb-2 h-6 w-6 text-muted/60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
          {paused ? "Auto refresh đang tắt" : "Waiting for LLM requests..."}
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {items.map((r, idx) => (
            <li key={`${r.timestamp}-${idx}`} className="px-4 py-3">
              <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
                <span className="font-mono text-emerald-300/90">{r.model}</span>
                <span>{fmtAgo(r.timestamp)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-emerald-400">
                  {fmtUsd(estimateUsd(r.promptTokens, r.completionTokens))}
                </span>
                <span className="text-muted">
                  <span className="text-sky-300">
                    {fmtTokens(r.promptTokens)}
                  </span>
                  {" → "}
                  <span className="text-fuchsia-300">
                    {fmtTokens(r.completionTokens)}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
