const slides = document.querySelectorAll(".slide");
const credit = document.getElementById("photo-credit");
const cookieBanner = document.getElementById("cookie-banner");
const cookiePreferences = document.getElementById("cookie-preferences");
const analyticsConsentInput = document.getElementById("analytics-consent");

let current = 0;
let lastFocusedElement = null;
let inMemoryConsent = null;
let googleAnalyticsLoaded = false;

const slideDurationMs = 6000;
const consentStorageKey = "materaTravelCookieConsent";
const consentVersion = 1;
const consentDurationMs = 180 * 24 * 60 * 60 * 1000;
const gaMeasurementId = "G-7WE1NRHQP3";
const gaScriptId = "google-analytics-gtag";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateCredit() {
  const text = slides[current].dataset.credit || "";
  const url = slides[current].dataset.creditUrl || "";

  if (!text) {
    credit.textContent = "";
    credit.hidden = true;
    return;
  }

  credit.hidden = false;

  if (url) {
    credit.innerHTML = `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`;
  } else {
    credit.textContent = text;
  }
}

function showNextSlide() {
  slides[current].classList.remove("active");
  current = (current + 1) % slides.length;
  slides[current].classList.add("active");
  updateCredit();
}

function getStoredConsent() {
  if (inMemoryConsent) {
    return inMemoryConsent;
  }

  try {
    const value = window.localStorage.getItem(consentStorageKey);

    if (!value) {
      return null;
    }

    const consent = JSON.parse(value);

    const expiresAt = Date.parse(consent.expiresAt);

    if (
      consent.version !== consentVersion ||
      typeof consent.analytics !== "boolean" ||
      !Number.isFinite(expiresAt) ||
      expiresAt <= Date.now()
    ) {
      window.localStorage.removeItem(consentStorageKey);
      return null;
    }

    inMemoryConsent = consent;
    return consent;
  } catch {
    return null;
  }
}

function storeConsent(analytics) {
  const consent = {
    analytics,
    version: consentVersion,
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + consentDurationMs).toISOString(),
  };

  inMemoryConsent = consent;

  try {
    window.localStorage.setItem(consentStorageKey, JSON.stringify(consent));
  } catch {
    // The consent still applies for the current page view if storage is unavailable.
  }

  return consent;
}

function getRootDomain(hostname) {
  const parts = hostname.split(".").filter(Boolean);

  if (parts.length <= 2) {
    return hostname;
  }

  return parts.slice(-2).join(".");
}

function expireCookie(name, domain) {
  const domainAttribute = domain ? `; domain=${domain}` : "";
  document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; path=/; SameSite=Lax${domainAttribute}`;
}

function deleteGoogleAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter((name) => /^_ga/.test(name) || name === "_gid" || name === "_gat" || name.startsWith("_gac_"));

  const hostname = window.location.hostname;
  const rootDomain = getRootDomain(hostname);
  const domains = new Set(["", hostname, `.${hostname}`, rootDomain, `.${rootDomain}`]);

  cookieNames.forEach((name) => {
    domains.forEach((domain) => expireCookie(name, domain));
  });
}

function ensureGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  return window.gtag;
}

function loadGoogleAnalytics() {
  window[`ga-disable-${gaMeasurementId}`] = false;

  const gtag = ensureGtag();

  gtag("consent", "default", {
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: "denied",
    security_storage: "granted",
  });

  gtag("consent", "update", {
    ad_personalization: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    analytics_storage: "granted",
  });

  gtag("js", new Date());
  gtag("config", gaMeasurementId, {
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    anonymize_ip: true,
  });

  if (googleAnalyticsLoaded || document.getElementById(gaScriptId)) {
    googleAnalyticsLoaded = true;
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.id = gaScriptId;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
  document.head.appendChild(script);
  googleAnalyticsLoaded = true;
}

function disableGoogleAnalytics() {
  window[`ga-disable-${gaMeasurementId}`] = true;

  if (window.gtag) {
    window.gtag("consent", "update", {
      ad_personalization: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      analytics_storage: "denied",
    });
  }

  deleteGoogleAnalyticsCookies();
}

function hideCookieBanner() {
  if (cookieBanner) {
    cookieBanner.hidden = true;
  }
}

function closeCookiePreferences() {
  if (cookiePreferences) {
    cookiePreferences.hidden = true;
  }

  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function openCookiePreferences() {
  if (!cookiePreferences || !analyticsConsentInput) {
    return;
  }

  const consent = getStoredConsent();
  analyticsConsentInput.checked = Boolean(consent?.analytics);
  lastFocusedElement = document.activeElement;
  cookiePreferences.hidden = false;

  const closeButton = cookiePreferences.querySelector("[data-close-cookie-preferences]");

  if (closeButton) {
    closeButton.focus();
  }
}

function applyConsent(analytics) {
  storeConsent(analytics);
  hideCookieBanner();
  closeCookiePreferences();

  if (analytics) {
    loadGoogleAnalytics();
  } else {
    disableGoogleAnalytics();
  }
}

function initConsentControls() {
  const consent = getStoredConsent();

  if (consent) {
    hideCookieBanner();

    if (consent.analytics) {
      loadGoogleAnalytics();
    } else {
      disableGoogleAnalytics();
    }
  } else if (cookieBanner) {
    cookieBanner.hidden = false;
    disableGoogleAnalytics();
  }

  document.querySelectorAll("[data-cookie-accept]").forEach((button) => {
    button.addEventListener("click", () => applyConsent(true));
  });

  document.querySelectorAll("[data-cookie-reject]").forEach((button) => {
    button.addEventListener("click", () => applyConsent(false));
  });

  document.querySelectorAll("[data-open-cookie-preferences]").forEach((button) => {
    button.addEventListener("click", openCookiePreferences);
  });

  document.querySelectorAll("[data-close-cookie-preferences]").forEach((button) => {
    button.addEventListener("click", closeCookiePreferences);
  });

  document.querySelectorAll("[data-cookie-save]").forEach((button) => {
    button.addEventListener("click", () => applyConsent(Boolean(analyticsConsentInput?.checked)));
  });

  if (cookiePreferences) {
    cookiePreferences.addEventListener("click", (event) => {
      if (event.target === cookiePreferences) {
        closeCookiePreferences();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cookiePreferences && !cookiePreferences.hidden) {
      closeCookiePreferences();
    }
  });
}

updateCredit();
setInterval(showNextSlide, slideDurationMs);
initConsentControls();
