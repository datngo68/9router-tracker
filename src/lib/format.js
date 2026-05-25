// Number/token formatting helpers, mirrored from 9router's account UI.

export function n(v) {
  return Number(v || 0).toLocaleString("vi-VN");
}

export function fmtTokens(v) {
  const num = Number(v || 0);
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(0)}k`;
  return String(num);
}

export function fmtVnd(v) {
  return Number(v || 0).toLocaleString("vi-VN") + "đ";
}

// Frontend-only price model for the standalone tracker — independent of
// the actual VND pricing on 9router. Customers see a flat USD estimate at
// $5 / 1M input + $30 / 1M output tokens.
const USD_PER_INPUT_TOKEN = 5 / 1_000_000;
const USD_PER_OUTPUT_TOKEN = 30 / 1_000_000;

export function estimateUsd(promptTokens = 0, completionTokens = 0) {
  return (
    (Number(promptTokens) || 0) * USD_PER_INPUT_TOKEN +
    (Number(completionTokens) || 0) * USD_PER_OUTPUT_TOKEN
  );
}

export function fmtUsd(v) {
  const num = Number(v) || 0;
  // Show 4 decimals under $1 so micro-amounts don't all read as $0.00.
  const fractionDigits = num < 1 ? 4 : 2;
  return "$" + num.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", { hour12: false });
}

export function fmtClock(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("vi-VN", { hour12: false });
}

// Compact relative time: "47s", "30m", "1h", "6h", "2d".
export function fmtAgo(iso, nowMs = Date.now()) {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "—";
  const seconds = Math.max(0, Math.floor((nowMs - t) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

// Status from the public API may be a number (HTTP code) or a string
// like "ok" / "success" / "error". Normalise to a boolean.
export function isStatusOk(status) {
  if (status == null) return true;
  if (typeof status === "number") return status >= 200 && status < 300;
  const s = String(status).trim().toLowerCase();
  if (!s) return true;
  if (s === "ok" || s === "success" || s === "completed" || s === "done") return true;
  const asNum = Number(s);
  if (!Number.isNaN(asNum)) return asNum >= 200 && asNum < 300;
  return false;
}

// Render label for the Status column. Returns "Success" or "Error <code>".
export function statusLabel(status) {
  if (isStatusOk(status)) return "Success";
  if (status == null || status === "") return "Error";
  if (typeof status === "number") return `Error ${status}`;
  const s = String(status).trim();
  const asNum = Number(s);
  if (!Number.isNaN(asNum)) return `Error ${asNum}`;
  // String like "error" / "failed" → just "Error"; otherwise show the value.
  if (/^err(or)?$|^fail(ed)?$/i.test(s)) return "Error";
  return `Error: ${s}`;
}

// Infer the request path from provider since the public API doesn't
// expose the raw path. Best-effort cosmetic mapping for the logs view.
export function inferPath(provider) {
  const p = String(provider || "").toLowerCase();
  if (p === "anthropic" || p === "claude") return "/v1/messages";
  if (p === "google" || p === "gemini") return "/v1beta/models";
  return "/v1/chat/completions";
}
