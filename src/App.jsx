import { useState, useEffect } from "react";
import KeyForm from "./components/KeyForm.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { ENV_BASE_URL, HAS_ENV_BASE_URL, DEFAULT_DEV_BASE_URL } from "./lib/config.js";

const STORAGE_KEY = "9router-tracker:session";
// Persist only the API key when env-baked URL is fixed; otherwise persist both.

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.apiKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

function resolveBaseUrl(saved) {
  if (HAS_ENV_BASE_URL) return ENV_BASE_URL;
  return saved?.baseUrl || "";
}

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const saved = loadSaved();
    if (!saved?.apiKey) return;
    const baseUrl = resolveBaseUrl(saved);
    if (!baseUrl) return; // env không có và localStorage không có URL
    setSession({ apiKey: saved.apiKey, baseUrl });
  }, []);

  function handleSubmit({ apiKey, baseUrl, remember }) {
    const finalBase = HAS_ENV_BASE_URL ? ENV_BASE_URL : baseUrl;
    setSession({ apiKey, baseUrl: finalBase });
    if (remember) {
      try {
        const payload = HAS_ENV_BASE_URL
          ? { apiKey }
          : { apiKey, baseUrl: finalBase };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {}
    } else {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  }

  function handleLogout() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setSession(null);
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {!session ? (
        <KeyForm
          onSubmit={handleSubmit}
          fixedBaseUrl={HAS_ENV_BASE_URL ? ENV_BASE_URL : null}
          defaultBaseUrl={DEFAULT_DEV_BASE_URL}
        />
      ) : (
        <Dashboard
          apiKey={session.apiKey}
          baseUrl={session.baseUrl}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
