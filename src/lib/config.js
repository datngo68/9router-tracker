// Centralised env reader. Vite inlines `import.meta.env.VITE_*` at build time,
// so deploying to Cloudflare Pages with `VITE_API_BASE_URL` set means the
// resulting bundle has the URL hard-coded — customers never see/edit it.

const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim();

export const ENV_BASE_URL = RAW_BASE.replace(/\/$/, "");
export const HAS_ENV_BASE_URL = ENV_BASE_URL.length > 0;
export const APP_NAME = (import.meta.env.VITE_APP_NAME || "9Router Key Tracker").trim();

// Default placeholder shown only when no env URL — local dev convenience.
export const DEFAULT_DEV_BASE_URL = "http://localhost:20128";
