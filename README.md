# 9Router Key Tracker

Standalone web app cho khách hàng dán API key của 9router và theo dõi token đã dùng theo thời gian thực (poll 5 giây).

App chạy hoàn toàn trên trình duyệt — không có backend riêng. Key chỉ được gửi đến server 9router (endpoint `/api/public/key-usage`) để đọc thống kê.

## Tính năng

- Paste API key → xem usage daily / monthly / lifetime + chart 7 ngày + top model + 10 request gần nhất.
- Polling tự động 5 giây, dừng khi key sai.
- Base URL của server 9router cấu hình qua biến môi trường lúc build → khách chỉ thấy 1 ô paste key.

## Phát triển local

```bash
npm install
cp .env.example .env
# sửa VITE_API_BASE_URL trong .env nếu muốn pre-fill
npm run dev
```

Mở `http://localhost:5173`.

## Build production

```bash
npm run build
```

Output ở `dist/`. Có thể serve bằng bất kỳ static host nào.

## Deploy lên Cloudflare Pages

1. Push repo này lên GitHub.
2. Cloudflare Dashboard → Pages → Create project → Connect Git → chọn repo.
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Environment variables (cả Production và Preview):
   - `VITE_API_BASE_URL` = URL của server 9router (vd `https://router.example.com`)
   - `VITE_APP_NAME` = tên hiển thị (tuỳ chọn)
5. Save & Deploy.

Khi `VITE_API_BASE_URL` đã set, ô Base URL trong form sẽ tự ẩn — khách chỉ paste API key.

## Yêu cầu phía server 9router

Endpoint `GET /api/public/key-usage` đã có sẵn trong 9router. Endpoint này:
- Xác thực bằng `Authorization: Bearer <api-key>`.
- Trả CORS `*` — không cần cấu hình `corsAllowedOrigins` cho domain Cloudflare.
- Rate-limit 30 req/phút/key.

Nếu server 9router của bạn chạy phía sau reverse proxy, đảm bảo header `Authorization` được forward.

## Stack

- Vite 5 + React 18
- Tailwind CSS 3
- Recharts (chart)
