import { fmtTokens, n } from "../lib/format.js";

function Bar({ used, limit, label }) {
  const isUnlimited = !limit || limit <= 0;
  if (isUnlimited) {
    return (
      <div>
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 text-sm">{n(used)} <span className="text-muted">tokens</span></p>
        <p className="text-[11px] text-muted">không giới hạn</p>
      </div>
    );
  }
  const pct = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>{fmtTokens(used)} / {fmtTokens(limit)}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-surface2">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function UsageBars({ usage, limits }) {
  return (
    <div className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-3">
      <Bar
        used={usage?.daily?.usedTokens || 0}
        limit={usage?.daily?.dailyTokenLimit || limits?.dailyTokenLimit || 0}
        label="Hôm nay"
      />
      <Bar
        used={usage?.monthly?.totalTokens || 0}
        limit={usage?.monthly?.limit || limits?.monthlyTokenLimit || 0}
        label="Tháng này"
      />
      <Bar
        used={usage?.lifetime?.totalTokens || 0}
        limit={usage?.lifetime?.limit || limits?.lifetimeTokenLimit || 0}
        label="Lifetime"
      />
    </div>
  );
}
