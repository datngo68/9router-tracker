import { useEffect, useRef, useState } from "react";
import { APP_NAME } from "../lib/config.js";

export default function KeyForm({ onSubmit, fixedBaseUrl, defaultBaseUrl }) {
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState(fixedBaseUrl || defaultBaseUrl || "");
  const [remember, setRemember] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [hint, setHint] = useState("");
  const [pasting, setPasting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  async function pasteFromClipboard() {
    setHint("");
    setPasting(true);
    try {
      const text = await navigator.clipboard.readText();
      if (text) setApiKey(text.trim());
    } catch {
      setHint("Trình duyệt không cho phép đọc clipboard. Hãy paste thủ công bằng Ctrl+V.");
    } finally {
      setPasting(false);
    }
  }

  function submit(e) {
    e?.preventDefault?.();
    setHint("");
    const k = apiKey.trim();
    if (!k) return setHint("Hãy paste API key của bạn.");
    if (!fixedBaseUrl) {
      const b = (baseUrl || "").trim().replace(/\/$/, "");
      if (!b) return setHint("Nhập Base URL của 9router.");
      if (!/^https?:\/\//.test(b)) return setHint("Base URL phải bắt đầu bằng http:// hoặc https://");
      onSubmit({ apiKey: k, baseUrl: b, remember });
    } else {
      onSubmit({ apiKey: k, baseUrl: fixedBaseUrl, remember });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-primary" aria-hidden="true">
              <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
          <p className="mt-2 text-sm text-muted">
            Theo dõi token đã dùng theo thời gian thực. Chỉ cần paste API key của bạn.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-2xl">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">API Key</label>
          <div className="mt-1.5 flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onPaste={(e) => {
                  // Strip whitespace from paste — users sometimes copy with trailing newline.
                  const txt = e.clipboardData?.getData("text") || "";
                  if (txt) {
                    e.preventDefault();
                    setApiKey(txt.trim());
                  }
                }}
                placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full rounded-lg border border-border bg-surface2 px-3 py-2.5 pr-10 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-text"
                aria-label={showKey ? "Ẩn key" : "Hiện key"}
              >
                {showKey ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.5A10.6 10.6 0 0 1 12 4.3c5 0 9 3.7 10 7.7-.5 1.6-1.4 3-2.6 4.2M6.6 6.6C4.7 8 3.4 9.9 2.8 12c1 4 5 7.7 10 7.7 1.7 0 3.3-.4 4.7-1.2"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <button
              type="button"
              onClick={pasteFromClipboard}
              disabled={pasting}
              className="rounded-lg border border-border bg-surface2 px-3 text-xs font-medium text-muted hover:text-text disabled:opacity-50"
            >
              {pasting ? "..." : "Paste"}
            </button>
          </div>

          {!fixedBaseUrl && (
            <>
              <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-muted">Base URL</label>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://router.example.com"
                className="mt-1.5 w-full rounded-lg border border-border bg-surface2 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                autoComplete="off"
              />
              <p className="mt-1 text-[11px] text-muted">
                Chỉ hiện vì admin chưa cấu hình <code className="rounded bg-surface2 px-1">VITE_API_BASE_URL</code>.
              </p>
            </>
          )}

          <label className="mt-4 flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded border-border bg-surface2"
            />
            Nhớ key trên trình duyệt này
          </label>

          {hint && (
            <p className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">{hint}</p>
          )}

          <button
            type="submit"
            className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow transition hover:bg-primary/90 active:scale-[0.99]"
          >
            Theo dõi key
          </button>

          {fixedBaseUrl && (
            <p className="mt-4 text-center text-[11px] text-muted">
              Server đã được cấu hình sẵn.
            </p>
          )}
        </form>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
          App chạy hoàn toàn trên trình duyệt. Key chỉ gửi tới máy chủ để đọc thống kê
          {fixedBaseUrl ? "" : " — đảm bảo Base URL đúng"}, không qua máy chủ trung gian nào khác.
        </p>
      </div>
    </div>
  );
}
