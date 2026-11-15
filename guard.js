// netlify/functions/lib/guard.js — حماية مشتركة: الأصل المسموح + حدّ الاستعمال لكل زائر
// الإعداد (اختياري) في Netlify → Environment variables:
//   ALLOWED_ORIGINS = https://savy.netlify.app,https://www.موقعك.ma   (افتراضياً: savy.netlify.app فقط)
//   ALLOW_LOCAL     = 1   (للتجربة على localhost فقط)
const hits = new Map(); // ip -> { min: [timestamps], day: {d, n} } (ذاكرة النسخة الحالية — حماية جيدة وليست مطلقة)

function allowedOrigins() {
  const list = (process.env.ALLOWED_ORIGINS || "https://savy.netlify.app").split(",").map(s => s.trim()).filter(Boolean);
  if (process.env.ALLOW_LOCAL === "1") list.push("http://localhost:8888", "http://localhost:3000", "http://127.0.0.1:8888");
  return list;
}

function headersFor(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

function clientIp(event) {
  const h = event.headers || {};
  return h["x-nf-client-connection-ip"] || (h["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
}

// يرجع { ok:true, headers } أو { ok:false, response }
function check(event, { perMinute, perDay, maxBody }) {
  const h = event.headers || {};
  const origin = h.origin || h.Origin || "";
  if (!allowedOrigins().includes(origin)) {
    return { ok: false, response: { statusCode: 403, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "forbidden_origin" }) } };
  }
  const headers = headersFor(origin);
  if (event.httpMethod === "OPTIONS") return { ok: false, response: { statusCode: 204, headers, body: "" } };
  if (event.httpMethod !== "POST") return { ok: false, response: { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) } };
  if (maxBody && (event.body || "").length > maxBody) return { ok: false, response: { statusCode: 413, headers, body: JSON.stringify({ error: "too_large" }) } };

  const ip = clientIp(event), now = Date.now(), day = new Date().toISOString().slice(0, 10);
  let r = hits.get(ip);
  if (!r) { r = { min: [], day: { d: day, n: 0 } }; hits.set(ip, r); }
  if (r.day.d !== day) r.day = { d: day, n: 0 };
  r.min = r.min.filter(t => now - t < 60000);
  if (r.min.length >= perMinute || r.day.n >= perDay) {
    return { ok: false, response: { statusCode: 429, headers: { ...headers, "Retry-After": "60" }, body: JSON.stringify({ error: "rate_limited" }) } };
  }
  r.min.push(now); r.day.n++;
  if (hits.size > 5000) { for (const k of hits.keys()) { hits.delete(k); if (hits.size < 2500) break; } }
  return { ok: true, headers };
}

module.exports = { check };
