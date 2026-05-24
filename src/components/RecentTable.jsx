import { n, fmtUsd, estimateUsd, fmtTime } from "../lib/format.js";

export default function RecentTable({ rows }) {
  const list = rows || [];
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold">Request gần nhất</h2>
      {list.length === 0 ? (
        <p className="mt-3 text-xs text-muted">Chưa có request nào.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr>
                <th className="px-2 py-2 text-left font-normal">Thời gian</th>
                <th className="px-2 py-2 text-left font-normal">Model</th>
                <th className="px-2 py-2 text-right font-normal">Input</th>
                <th className="px-2 py-2 text-right font-normal">Output</th>
                <th className="px-2 py-2 text-right font-normal">Chi phí ước tính</th>
                <th className="px-2 py-2 text-right font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.map((r, idx) => (
                <tr key={`${r.timestamp}-${idx}`}>
                  <td className="px-2 py-2 text-xs">{fmtTime(r.timestamp)}</td>
                  <td className="px-2 py-2 font-mono text-xs">{r.provider || "?"}/{r.model || "?"}</td>
                  <td className="px-2 py-2 text-right">{n(r.promptTokens)}</td>
                  <td className="px-2 py-2 text-right">{n(r.completionTokens)}</td>
                  <td className="px-2 py-2 text-right text-muted">{fmtUsd(estimateUsd(r.promptTokens, r.completionTokens))}</td>
                  <td className="px-2 py-2 text-right text-xs">{r.status ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
