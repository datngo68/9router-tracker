import { useEffect, useState } from "react";
import { fmtAgo, fmtUsd, estimateUsd, n, fmtTokens, inferPath, isStatusOk, statusLabel } from "../lib/format.js";

function ModelChip({ model }) {
  if (!model) return <span className="text-muted">—</span>;
  return (
    <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 font-mono text-[11px] text-emerald-300/90">
      {model}
    </span>
  );
}

function StatusChip({ status }) {
  const ok = isStatusOk(status);
  const cls = ok
    ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
    : "bg-red-500/10 text-red-400 ring-red-500/20";
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] ring-1 ${cls}`}>
      {statusLabel(status)}
    </span>
  );
}

export default function LogsTable({ rows }) {
  // Re-render every second so the relative TIME column ticks ("47s" → "48s").
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const list = rows || [];

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold tracking-tight">Time</h2>
      </div>
      {list.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-muted">
          Không có request nào khớp bộ lọc.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-[10px] uppercase tracking-wider text-muted">
              <tr className="border-b border-border/60">
                <th className="px-4 py-2.5 text-left font-medium">Time</th>
                <th className="px-4 py-2.5 text-left font-medium">Model</th>
                <th className="px-4 py-2.5 text-left font-medium">Path</th>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Cost</th>
                <th className="px-4 py-2.5 text-right font-medium">Input</th>
                <th className="px-4 py-2.5 text-right font-medium">Output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.map((r, idx) => (
                <tr
                  key={`${r.timestamp}-${idx}`}
                  className="transition-colors hover:bg-surface2/60"
                >
                  <td className="px-4 py-2.5 text-xs text-muted">
                    {fmtAgo(r.timestamp)}
                  </td>
                  <td className="px-4 py-2.5">
                    <ModelChip model={r.model} />
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted">
                    {inferPath(r.provider)}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusChip status={r.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs text-emerald-400">
                    {fmtUsd(estimateUsd(r.promptTokens, r.completionTokens))}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs text-sky-300">
                    {fmtTokens(r.promptTokens)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs text-fuchsia-300">
                    {n(r.completionTokens)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
