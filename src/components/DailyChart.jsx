import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { n } from "../lib/format.js";

function shortDay(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export default function DailyChart({ days }) {
  const data = (days || []).map((d) => ({
    day: shortDay(d.day),
    prompt: d.promptTokens || 0,
    completion: d.completionTokens || 0,
  }));
  const empty = data.every((d) => d.prompt === 0 && d.completion === 0);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Token theo ngày (7 ngày gần nhất)</h2>
        {empty && <span className="text-xs text-muted">Chưa có dữ liệu</span>}
      </div>
      <div className="mt-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262b33" vertical={false} />
            <XAxis dataKey="day" stroke="#8b94a3" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#8b94a3" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
            <Tooltip
              cursor={{ fill: "rgba(91,141,239,0.08)" }}
              contentStyle={{ background: "#13161b", border: "1px solid #262b33", borderRadius: 8, fontSize: 12 }}
              formatter={(value, name) => [n(value), name === "prompt" ? "Input" : "Output"]}
            />
            <Legend formatter={(v) => v === "prompt" ? "Input" : "Output"} wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="prompt" stackId="a" fill="#5b8def" radius={[0, 0, 0, 0]} />
            <Bar dataKey="completion" stackId="a" fill="#8ab4ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
