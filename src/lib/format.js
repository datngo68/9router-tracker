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
