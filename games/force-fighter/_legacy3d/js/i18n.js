/**
 * Lightweight i18n: English (en) and Bengali (bn) only.
 * Locale JSON lives in /locales/{code}.json (bundled fallback if fetch fails).
 */

import enBundled from "../locales/en.json" with { type: "json" };
import bnBundled from "../locales/bn.json" with { type: "json" };

const BUNDLED_LOCALES = { en: enBundled, bn: bnBundled };

export const LOCALE_STORAGE_KEY = "force-fighter-locale";
export const LOCALES = [
  { code: "en", labelKey: "shell.langEn" },
  { code: "bn", labelKey: "shell.langBn" },
];

/** @type {"en"|"bn"} */
let locale = "en";
/** @type {Record<string, unknown>} */
let dict = {};
/** @type {(() => void)[]} */
const listeners = [];

function mergeLocale(bundled, fetched) {
  if (!fetched || typeof fetched !== "object") return { ...bundled };
  const out = { ...bundled };
  for (const key of Object.keys(fetched)) {
    const b = bundled[key];
    const f = fetched[key];
    if (
      f &&
      typeof f === "object" &&
      !Array.isArray(f) &&
      b &&
      typeof b === "object" &&
      !Array.isArray(b)
    ) {
      out[key] = { ...b, ...f };
    } else {
      out[key] = f;
    }
  }
  return out;
}

function getNested(obj, path) {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = /** @type {Record<string, unknown>} */ (cur)[p];
  }
  return typeof cur === "string" ? cur : undefined;
}

/**
 * @param {string} key Dot path, e.g. shell.hint or adv.s0001
 * @param {Record<string, string | number>} [params]
 */
export function t(key, params) {
  let str = getNested(dict, key);
  if (str == null) {
    if (typeof console !== "undefined") console.warn("[i18n] missing:", key, "locale:", locale);
    return locale === "bn" ? "…" : key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

/** Locale strings may include simple HTML (<strong>, <em>). */
export function tHtml(key, params) {
  return t(key, params);
}

export function getLocale() {
  return locale;
}

export function onLocaleChange(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 * @param {Record<string, unknown>} data
 */
function applyDocumentLang(data) {
  document.documentElement.lang = locale === "bn" ? "bn" : "en";
  document.documentElement.dataset.locale = locale;
  if (locale === "bn") {
    document.body.classList.add("locale-bn");
  } else {
    document.body.classList.remove("locale-bn");
  }
}

/**
 * Update static shell elements marked with data-i18n / data-i18n-attr.
 */
export function updateLangSelectOptions() {
  const sel = document.getElementById("lang-select");
  if (!sel) return;
  const enOpt = sel.querySelector('option[value="en"]');
  const bnOpt = sel.querySelector('option[value="bn"]');
  if (enOpt) enOpt.textContent = locale === "bn" ? "ইংরেজি" : t("shell.langEn");
  if (bnOpt) bnOpt.textContent = locale === "bn" ? t("shell.langBn") : t("shell.langBnLatin");
}

export function applyShellI18n() {
  updateLangSelectOptions();
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (el.id === "btn-playground") return;
    const key = el.getAttribute("data-i18n");
    if (!key) return;
    const attr = el.getAttribute("data-i18n-attr");
    const val = t(key);
    if (attr) el.setAttribute(attr, val);
    else el.textContent = val;
  });
  const titleEl = document.querySelector("title[data-i18n]");
  if (titleEl) document.title = t(titleEl.getAttribute("data-i18n") || "shell.appTitle");
}

/**
 * @param {"en"|"bn"} code
 */
export async function loadLocale(code) {
  const bundled = BUNDLED_LOCALES[code] || BUNDLED_LOCALES.en;
  try {
    const res = await fetch(`locales/${code}.json`);
    if (res.ok) {
      const fetched = await res.json();
      dict = mergeLocale(bundled, fetched);
    } else {
      dict = { ...bundled };
    }
  } catch {
    dict = { ...bundled };
  }
  locale = code;
  applyDocumentLang(dict);
}

/**
 * @param {"en"|"bn"} code
 * @param {{ silent?: boolean }} [opts]
 */
export async function setLocale(code, opts = {}) {
  if (code !== "en" && code !== "bn") return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, code);
  } catch {
    /* private mode */
  }
  await loadLocale(code);
  applyShellI18n();
  if (!opts.silent) notify();
}

export async function initI18n() {
  let saved = "en";
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw === "bn" || raw === "en") saved = raw;
  } catch {
    /* ignore */
  }
  await setLocale(saved, { silent: true });
}

/** Translated level meta for progress UI and quizzes. */
export function getLevelMeta() {
  let levels = /** @type {Array<Record<string, unknown>>} */ (dict.levels || []);
  if (!Array.isArray(levels) || levels.length === 0) {
    const fallback = BUNDLED_LOCALES[locale] || BUNDLED_LOCALES.en;
    levels = /** @type {Array<Record<string, unknown>>} */ (fallback.levels || []);
  }
  return levels.map((m, i) => ({
    kidTitle: String(m.kidTitle || ""),
    forceTheme: String(m.forceTheme || "push"),
    emoji: String(m.emoji || ""),
    rewardName: String(m.rewardName || ""),
    intro: String(m.intro || ""),
    everyday: Array.isArray(m.everyday) ? m.everyday.map(String) : [],
    quiz: Array.isArray(m.quiz)
      ? m.quiz.map((q) => ({
          q: String(q.q || ""),
          opts: Array.isArray(q.opts) ? q.opts.map(String) : [],
          ok: typeof q.ok === "number" ? q.ok : 0,
        }))
      : [],
  }));
}

export function tForceTheme(theme) {
  return t(`forceNames.${theme}`) || theme;
}
