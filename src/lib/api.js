// Single endpoint client: GET <baseUrl>/api/public/key-usage with Bearer key.
// We surface a typed-ish error so the UI can distinguish auth vs network.

export async function fetchUsage({ baseUrl, apiKey, signal }) {
  if (!baseUrl) throw new ApiError("Thiếu Base URL của 9router", "config");
  if (!apiKey) throw new ApiError("Thiếu API key", "config");

  const url = `${baseUrl.replace(/\/$/, "")}/api/public/key-usage`;
  let res;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      signal,
    });
  } catch (e) {
    if (e?.name === "AbortError") throw e;
    throw new ApiError("Không kết nối được tới máy chủ. Kiểm tra mạng hoặc thử lại sau.", "network");
  }

  if (res.status === 401) {
    throw new ApiError("Key không hợp lệ", "auth");
  }
  if (res.status === 429) {
    throw new ApiError("Quá nhiều request, thử lại sau ít giây", "rate_limit");
  }
  if (!res.ok) {
    let msg = `Lỗi ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {}
    throw new ApiError(msg, "server");
  }

  return res.json();
}

export class ApiError extends Error {
  constructor(message, kind) {
    super(message);
    this.kind = kind || "unknown";
  }
}
