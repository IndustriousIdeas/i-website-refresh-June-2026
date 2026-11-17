// Records who opened the password-protected portfolio at /work.
// Each sign-in is written to the function log. If LEADS_WEBHOOK_URL is set in the
// Vercel project's environment variables, the same record is also posted there
// (for example a Google Apps Script web app that appends a row to a Sheet).
module.exports = async (req, res) => {
  if (req.method !== "POST") { res.statusCode = 405; return res.end(); }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const email = String(body.email || "").trim().slice(0, 200);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { res.statusCode = 400; return res.end(); }
  const record = {
    event: "portfolio_view",
    email,
    ok: !!body.ok,
    ref: String(body.ref || "").slice(0, 100),
    utm_source: String(body.utm_source || "").slice(0, 100),
    utm_medium: String(body.utm_medium || "").slice(0, 100),
    utm_campaign: String(body.utm_campaign || "").slice(0, 100),
    utm_content: String(body.utm_content || "").slice(0, 100),
    utm_term: String(body.utm_term || "").slice(0, 100),
    page: String(body.page || "").slice(0, 100),
    at: new Date().toISOString(),
    country: req.headers["x-vercel-ip-country"] || "",
    city: decodeURIComponent(req.headers["x-vercel-ip-city"] || ""),
  };
  console.log(JSON.stringify(record));
  const hook = process.env.LEADS_WEBHOOK_URL;
  if (hook) {
    try { await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(record) }); }
    catch (e) { console.error("webhook failed", e.message); }
  }
  res.statusCode = 204;
  res.end();
};
