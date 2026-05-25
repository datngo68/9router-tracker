import { useMemo, useState } from "react";
import FilterBar from "./FilterBar.jsx";
import LogsTable from "./LogsTable.jsx";
import LiveActivity from "./LiveActivity.jsx";

const DEFAULT_FILTERS = {
  dateRange: "today",
  groupBy: "hour",
  model: "",
  status: "all",
};

function startOfTodayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function rangeStartMs(range) {
  const now = Date.now();
  switch (range) {
    case "today":
      return startOfTodayMs();
    case "24h":
      return now - 24 * 60 * 60 * 1000;
    case "7d":
      return now - 7 * 24 * 60 * 60 * 1000;
    case "all":
    default:
      return 0;
  }
}

function applyFilters(rows, filters) {
  if (!rows) return [];
  const start = rangeStartMs(filters.dateRange);
  const modelQ = filters.model.trim().toLowerCase();
  return rows.filter((r) => {
    const t = new Date(r.timestamp).getTime();
    if (Number.isNaN(t)) return false;
    if (t < start) return false;
    if (modelQ && !String(r.model || "").toLowerCase().includes(modelQ)) {
      return false;
    }
    if (filters.status !== "all") {
      const s = r.status;
      const ok = s == null || (s >= 200 && s < 300);
      if (filters.status === "success" && !ok) return false;
      if (filters.status === "error" && ok) return false;
    }
    return true;
  });
}

export default function RequestLogs({ recent, autoRefresh, onAutoRefreshChange }) {
  const [draft, setDraft] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);

  const modelOptions = useMemo(() => {
    const set = new Set();
    for (const r of recent || []) {
      if (r.model) set.add(r.model);
    }
    return Array.from(set);
  }, [recent]);

  const filtered = useMemo(() => applyFilters(recent, applied), [recent, applied]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(applied);

  function handleApply() {
    setApplied(draft);
  }
  function handleReset() {
    setDraft(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
  }

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Request logs
          </h2>
          <p className="text-[11px] uppercase tracking-wider text-muted">
            Every recorded request
          </p>
        </div>
        <span className="text-xs text-muted">
          {filtered.length} / {recent?.length || 0} requests
        </span>
      </div>

      <FilterBar
        draft={draft}
        onDraftChange={setDraft}
        onApply={handleApply}
        onReset={handleReset}
        modelOptions={modelOptions}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={onAutoRefreshChange}
        dirty={dirty}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
        <LogsTable rows={filtered} />
        <LiveActivity recent={recent} paused={!autoRefresh} />
      </div>
    </section>
  );
}
