import { useState } from "react";
import { useUsage } from "../hooks/useUsage.js";
import UsageBars from "./UsageBars.jsx";
import DailyChart from "./DailyChart.jsx";
import ModelTable from "./ModelTable.jsx";
import RequestLogs from "./RequestLogs.jsx";
import { fmtClock, fmtUsd, estimateUsd, n } from "../lib/format.js";
import { APP_NAME } from "../lib/config.js";

function StatusBadge({ data }) {
  if (!data?.key) return null;
  const expired = data.key.expiresAt && new Date(data.key.expiresAt).getTime() < Date.now();
  const tone = expired
    ? "bg-red-500/10 text-red-400 ring-red-500/20"
    : data.key.isActive
      ? "bg-green-500/10 text-green-400 ring-green-500/20"
      : "bg-amber-500/10 text-amber-400 ring-amber-500/20";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ring-1 ${tone}`}>
      {expired ? "Hết hạn" : data.key.isActive ? "Đang hoạt động" : "Tạm dừng"}
    </span>
  );
}

function LiveDot({ stopped, loading }) {
  const cls = stopped
    ? "bg-red-500"
    : loading
      ? "bg-amber-400 animate-pulse"
      : "bg-green-500";
  return (
    <span className="relative inline-flex h-2 w-2">
      {!stopped && !loading && (
        <span className="absolute inset-0 animate-ping rounded-full bg-green-500/60" />
      )}
      <span className={`relative inline-block h-2 w-2 rounded-full ${cls}`} />
    </span>
  );
}

export default function Dashboard({ apiKey, baseUrl, onLogout }) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { data, error, loading, lastUpdated, stopped, refresh } = useUsage({
    apiKey,
    baseUrl,
    enabled: autoRefresh,
  });

  const totals = data?.last7d?.totals;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* App bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="text-sm font-medium tracking-tight">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] text-muted sm:inline-flex">
              <LiveDot stopped={stopped} loading={loading} />
              {stopped ? "Đã dừng" : `Cập nhật ${fmtClock(lastUpdated?.toISOString())}`}
            </span>
            <button
              onClick={refresh}
              className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface2"
            >
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-surface2"
            >
              Đổi key
            </button>
          </div>
        </div>

        {/* Key card */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-lg font-semibold">
                  {data?.key?.name || (loading ? "Đang tải..." : "Key của bạn")}
                </h1>
                <StatusBadge data={data} />
                {data?.key?.paygEnabled && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary ring-1 ring-primary/20">
                    PAYG
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                <code className="rounded bg-surface2 px-2 py-0.5 font-mono">{data?.key?.keyDisplay || "—"}</code>
                {data?.key?.expiresAt && (
                  <>
                    <span>·</span>
                    <span>Hết hạn: {new Date(data.key.expiresAt).toLocaleDateString("vi-VN")}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface2 px-3 py-1 text-[11px] text-muted sm:hidden">
              <LiveDot stopped={stopped} loading={loading} />
              {stopped ? "Đã dừng" : fmtClock(lastUpdated?.toISOString())}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
            <p className="font-semibold text-red-400">Lỗi: {error.message}</p>
            {error.kind === "auth" && (
              <p className="mt-1 text-xs text-red-300/80">
                Polling đã dừng. Bấm "Đổi key" để nhập key khác.
              </p>
            )}
            {error.kind === "network" && (
              <p className="mt-1 text-xs text-red-300/80">
                Không kết nối được tới máy chủ. Kiểm tra mạng hoặc thử lại sau.
              </p>
            )}
          </div>
        )}

        {!data && !error && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface" />
            ))}
          </div>
        )}

        {data && (
          <div className="mt-4 flex flex-col gap-4">
            <RequestLogs
              recent={data.recent}
              autoRefresh={autoRefresh}
              onAutoRefreshChange={setAutoRefresh}
            />

            <UsageBars usage={data.usage} limits={data.limits} />

            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Input (7 ngày)" value={n(totals?.promptTokens)} suffix="tokens" />
              <Stat label="Output (7 ngày)" value={n(totals?.completionTokens)} suffix="tokens" />
              <Stat label="Chi phí ước tính (7 ngày)" value={fmtUsd(estimateUsd(totals?.promptTokens, totals?.completionTokens))} hint="$5 / 1M input · $30 / 1M output" />
            </div>

            <DailyChart days={data.last7d?.byDay} />

            <ModelTable rows={data.last7d?.byModel} />
          </div>
        )}

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-[11px] text-muted">
          <span>Cập nhật mỗi 5 giây</span>
          <span>Key chỉ ở trong trình duyệt của bạn</span>
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value, suffix, hint }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">
        {value} {suffix && <span className="text-sm font-normal text-muted">{suffix}</span>}
      </p>
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}
