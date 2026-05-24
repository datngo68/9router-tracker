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
