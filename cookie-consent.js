(function () {
  // This banner controls tracking cookies only (Klaviyo's onsite analytics script).
  // It has no connection to email marketing consent, which is granted solely via
  // the explicit opt-in checkbox on the contact form.
  var CONSENT_KEY = "ii_cookie_consent_v2";
  var KLAVIYO_PUBLIC_KEY = "RuBkDm";

  function getConsent() {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY));
    } catch (e) {
      return null;
    }
  }

  function setConsent(analytics) {
    var record = { necessary: true, analytics: analytics, ts: new Date().toISOString() };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    } catch (e) {}
    applyConsent(record);
  }

  function applyConsent(record) {
    if (record && record.analytics) {
      loadKlaviyoOnsite();
    }
  }

  function loadKlaviyoOnsite() {
    if (window.__iiKlaviyoOnsiteLoaded) return;
    window.__iiKlaviyoOnsiteLoaded = true;
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=" + KLAVIYO_PUBLIC_KEY;
    document.head.appendChild(s);
  }

  function removeBanner() {
    var el = document.getElementById("ii-cookie-banner");
    if (el) el.remove();
  }

  function buildBanner() {
    removeBanner();
    var wrap = document.createElement("div");
    wrap.id = "ii-cookie-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Cookie preferences");
    wrap.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#1E1E1E;" +
      "font-family:'Sora',system-ui,-apple-system,sans-serif;padding:20px 24px;" +
      "box-shadow:0 -6px 24px rgba(0,0,0,.18);";
    wrap.innerHTML =
      '<div style="max-width:1080px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:20px;justify-content:space-between;">' +
      '<p style="margin:0;font-size:13px;line-height:1.6;color:rgba(255,242,233,.85);max-width:56ch;flex:1;min-width:240px;">' +
      "This site uses necessary cookies to function. With your consent, it also uses analytics cookies (via Klaviyo) to understand how visitors use the site. Analytics cookies stay off until you opt in. " +
      '<a href="/privacy" style="color:#FFF2E9;text-decoration:underline;">Read our cookie policy</a>.' +
      "</p>" +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
      '<button id="ii-cookie-necessary" type="button" style="background:transparent;border:1px solid rgba(255,242,233,.4);color:#FFF2E9;border-radius:9px;font-family:inherit;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:11px 18px;cursor:pointer;">Reject non-essential</button>' +
      '<button id="ii-cookie-accept" type="button" style="background:#E30A5C;border:none;color:#fff;border-radius:9px;font-family:inherit;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:11px 18px;cursor:pointer;">Accept all</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(wrap);
    document.getElementById("ii-cookie-accept").addEventListener("click", function () {
      setConsent(true);
      removeBanner();
    });
    document.getElementById("ii-cookie-necessary").addEventListener("click", function () {
      setConsent(false);
      removeBanner();
    });
  }

  function init() {
    var record = getConsent();
    if (record) {
      applyConsent(record);
    } else {
      buildBanner();
    }
  }

  window.iiCookiePreferences = buildBanner;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
