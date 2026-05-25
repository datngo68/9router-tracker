// Filter controls for the request logs table. Mirrors the screenshot:
// Date range | Group by | Model | Status | Reset | Apply | Auto refresh.
// All filters are applied client-side over the recent requests list since the
// public API only returns the last N entries.

const DATE_RANGES = [
  { value: "today", label: "Today" },
  { value: "24h", label: "Last 24h" },
  { value: "7d", label: "Last 7 days" },
  { value: "all", label: "All" },
];

const GROUP_BY = [
  { value: "none", label: "None" },
  { value: "hour", label: "By hour" },
  { value: "day", label: "By day" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
];

function Field({ label, children }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-lg border border-border bg-surface2 px-3 pr-8 text-sm text-text outline-none ring-primary/40 focus:ring-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="m6 8 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ModelSearch({ value, onChange, options }) {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <circle cx="9" cy="9" r="5.5" />
        <path d="m13.5 13.5 3 3" strokeLinecap="round" />
      </svg>
      <input
        list="model-options"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="all models"
        className="h-9 w-full rounded-lg border border-border bg-surface2 pl-8 pr-3 text-sm text-text placeholder:text-muted/70 outline-none ring-primary/40 focus:ring-2"
      />
      <datalist id="model-options">
        {options.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-surface2 ring-1 ring-border"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            checked ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
      <span>
        {label}: {checked ? "ON" : "OFF"}
      </span>
    </label>
  );
}

export default function FilterBar({
  draft,
  onDraftChange,
  onApply,
  onReset,
  modelOptions,
  autoRefresh,
  onAutoRefreshChange,
  dirty,
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 sm:p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[180px_180px_minmax(220px,1fr)_180px_auto]">
        <Field label="Date range">
          <Select
            value={draft.dateRange}
            onChange={(v) => onDraftChange({ ...draft, dateRange: v })}
            options={DATE_RANGES}
          />
        </Field>
        <Field label="Group by">
          <Select
            value={draft.groupBy}
            onChange={(v) => onDraftChange({ ...draft, groupBy: v })}
            options={GROUP_BY}
          />
        </Field>
        <Field label="Model">
          <ModelSearch
            value={draft.model}
            onChange={(v) => onDraftChange({ ...draft, model: v })}
            options={modelOptions}
          />
        </Field>
        <Field label="Status">
          <Select
            value={draft.status}
            onChange={(v) => onDraftChange({ ...draft, status: v })}
            options={STATUS_OPTIONS}
          />
        </Field>
        <div className="flex items-end justify-end gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface2 px-3 text-xs hover:bg-surface"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 10a6 6 0 1 1 1.76 4.24" strokeLinecap="round" />
              <path d="M4 5v4h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className={`inline-flex h-9 items-center rounded-lg px-4 text-xs font-medium transition-colors ${
              dirty
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-primary/60 text-white/80"
            }`}
          >
            Apply
          </button>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Toggle
          checked={autoRefresh}
          onChange={onAutoRefreshChange}
          label="Auto refresh"
        />
      </div>
    </div>
  );
}
