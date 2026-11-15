// netlify/functions/scan.js — تحليل صورة الطعام بالذكاء الاصطناعي (Groq Vision)
// المتغيرات المطلوبة في Netlify: GROQ_API_KEY  (اختياري: GROQ_VISION_MODEL)
// تحقق من النموذج المتاح حالياً في: https://console.groq.com/docs/vision
const https = require("https");
const { check } = require("./lib/guard");

const MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
const MAX_IMG_CHARS = 4_500_000; // ~3.3MB base64

const PROMPT = `You are a careful food-recognition and nutrition-estimation engine for SAVY, a Moroccan meal brand.
Look at the photo and identify each distinct food or drink item. For each item estimate the portion in grams (or ml) and its nutrition for THAT portion.
Be especially good at Moroccan food: couscous, chicken/beef/kefta tajine, harira, rfissa, pastilla, bissara, zaalouk, taktouka, msemen, baghrir, Moroccan salads, khobz, mint tea, dates, olives, grilled sardines, brochettes. Also Mediterranean, European and international food.
Rules:
- Return ONLY valid JSON, no prose, no markdown fences.
- If the image has no food, return {"items":[],"notes":"no_food"}.
- Do not invent items you cannot see. If unsure, lower "conf" (0 to 1) and say so in "notes".
- Numbers must be plausible: kcal consistent with 4*protein + 4*carbs + 9*fat (within ~15%).
- Names: "name" in French, "ar" in Arabic.
JSON schema:
{"items":[{"name":"string","ar":"string","grams":number,"kcal":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"conf":number}],"notes":"short string about uncertainty, hidden ingredients (oil, sugar) or portion"}`;

function call(apiKey, payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request({ hostname: "api.groq.com", path: "/openai/v1/chat/completions", method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}`, "Content-Length": Buffer.byteLength(body) } }, (res) => {
      let d = ""; res.on("data", c => d += c);
      res.on("end", () => resolve({ status: res.statusCode, raw: d }));
    });
    req.on("error", reject); req.setTimeout(25000, () => req.destroy(new Error("timeout")));
    req.write(body); req.end();
  });
}

const num = (v, lo, hi) => { v = Number(v); return Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : 0; };
function clean(parsed) {
  const items = (Array.isArray(parsed.items) ? parsed.items : []).slice(0, 12).map(it => ({
    name: String(it.name || "").slice(0, 80), ar: String(it.ar || "").slice(0, 80),
    grams: num(it.grams, 5, 2000), kcal: num(it.kcal, 0, 3500), protein: num(it.protein, 0, 250), carbs: num(it.carbs, 0, 500),
    fat: num(it.fat, 0, 250), fiber: num(it.fiber, 0, 100), sugar: num(it.sugar, 0, 300), conf: num(it.conf, 0, 1),
  })).filter(i => i.name && i.grams > 0);
  return { items, notes: String(parsed.notes || "").slice(0, 300) };
}

exports.handler = async (event) => {
  const g = check(event, { perMinute: 6, perDay: 40, maxBody: MAX_IMG_CHARS + 2000 });
  if (!g.ok) return g.response;
  const h = g.headers;
  const key = process.env.GROQ_API_KEY;
  if (!key) return { statusCode: 503, headers: h, body: JSON.stringify({ error: "no_key" }) };
  let b; try { b = JSON.parse(event.body); } catch { return { statusCode: 400, headers: h, body: JSON.stringify({ error: "bad_json" }) }; }
  const img = String(b.image || "");
  if (!/^data:image\/(jpeg|png|webp);base64,/.test(img)) return { statusCode: 400, headers: h, body: JSON.stringify({ error: "bad_image" }) };
  if (img.length > MAX_IMG_CHARS) return { statusCode: 413, headers: h, body: JSON.stringify({ error: "too_large" }) };
  const hint = String(b.hint || "").slice(0, 200);
  try {
    const r = await call(key, {
      model: MODEL, temperature: 0.2, max_tokens: 900,
      messages: [{ role: "user", content: [
        { type: "text", text: PROMPT + (hint ? `\nUser hint (may help identify the dish): ${hint}` : "") },
        { type: "image_url", image_url: { url: img } } ] }],
    });
    if (r.status < 200 || r.status >= 300) { console.error("Groq vision", r.status, r.raw.slice(0, 300)); return { statusCode: 502, headers: h, body: JSON.stringify({ error: "upstream", status: r.status }) }; }
    const txt = (JSON.parse(r.raw).choices || [{}])[0].message?.content || "";
    const m = txt.match(/\{[\s\S]*\}/); if (!m) return { statusCode: 502, headers: h, body: JSON.stringify({ error: "unparsable" }) };
    return { statusCode: 200, headers: h, body: JSON.stringify(clean(JSON.parse(m[0]))) };
  } catch (e) { console.error("scan error", e.message); return { statusCode: 502, headers: h, body: JSON.stringify({ error: "failed" }) }; }
};
