import { n, fmtVnd } from "../lib/format.js";

export default function ModelTable({ rows }) {
  const list = rows || [];
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold">Top model (7 ngày)</h2>
      {list.length === 0 ? (
        <p className="mt-3 text-xs text-muted">Chưa có request nào trong 7 ngày qua.</p>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-xs uppercase text-muted">
              <tr>
                <th className="px-2 py-2 text-left font-normal">Model</th>
                <th className="px-2 py-2 text-right font-normal">Requests</th>
                <th className="px-2 py-2 text-right font-normal">Input</th>
                <th className="px-2 py-2 text-right font-normal">Output</th>
                <th className="px-2 py-2 text-right font-normal">Chi phí</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {list.slice(0, 10).map((r) => (
                <tr key={r.fullId}>
                  <td className="px-2 py-2 font-mono text-xs">{r.fullId}</td>
                  <td className="px-2 py-2 text-right">{n(r.requests)}</td>
                  <td className="px-2 py-2 text-right">{n(r.promptTokens)}</td>
                  <td className="px-2 py-2 text-right">{n(r.completionTokens)}</td>
                  <td className="px-2 py-2 text-right text-muted">{fmtVnd(r.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
