/**
 * Shared i18n for GyanQuest engine (en / bn).
 */
import enBundled from "../locales/en.json" with { type: "json" };
import bnBundled from "../locales/bn.json" with { type: "json" };

const BUNDLED = { en: enBundled, bn: bnBundled };

/** @type {"en"|"bn"} */
let locale = "en";
/** @type {Record<string, unknown>} */
let dict = { ...enBundled };
/** @type {(() => void)[]} */
const listeners = [];
let storageKey = "gq-engine-locale";

function getNested(obj, path) {
 const parts = path.split(".");
 let cur = obj;
 for (const p of parts) {
 if (cur == null || typeof cur !== "object") return undefined;
 cur = cur[p];
 }
 return typeof cur === "string" ? cur : undefined;
}

export function t(key, params) {
 let str = getNested(dict, key);
 if (str == null) return locale === "bn" ? "…" : key;
 if (params) {
 for (const [k, v] of Object.entries(params)) {
 str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
 }
 }
 return str;
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

export function applyShellI18n(manifest) {
 document.querySelectorAll("[data-i18n]").forEach((el) => {
 const key = el.getAttribute("data-i18n");
 if (!key) return;
 let text = t(key);
 if (key === "shell.brandMark" && manifest?.title) text = manifest.title;
 if (key === "shell.brandH1" && manifest?.tagline) text = manifest.tagline;
 if (key === "shell.subjectTag" && manifest?.subjectTag) text = manifest.subjectTag;
 if (key === "shell.coachName" && manifest?.coachName) text = manifest.coachName;
 if (key === "shell.appTitle" && manifest?.title) {
 text = `${manifest.title} - GyanQuest`;
 document.title = text;
 }
 el.textContent = text;
 });
 document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
 const key = el.getAttribute("data-i18n");
 const attrs = (el.getAttribute("data-i18n-attr") || "").split(",");
 const val = t(key);
 attrs.forEach((a) => {
 const name = a.trim();
 if (name) el.setAttribute(name, val);
 });
 });
}

export async function initI18n({ localeStorageKey } = {}) {
 if (localeStorageKey) storageKey = localeStorageKey;
 try {
 const saved = localStorage.getItem(storageKey);
 if (saved === "bn" || saved === "en") locale = saved;
 } catch {
 /* private */
 }
 dict = { ...BUNDLED[locale] };
 document.documentElement.lang = locale === "bn" ? "bn" : "en";
 document.body.classList.toggle("locale-bn", locale === "bn");
}

export function setLocale(code) {
 if (code !== "en" && code !== "bn") return;
 locale = code;
 dict = { ...BUNDLED[locale] };
 try {
 localStorage.setItem(storageKey, locale);
 } catch {
 /* ignore */
 }
 document.documentElement.lang = locale === "bn" ? "bn" : "en";
 document.body.classList.toggle("locale-bn", locale === "bn");
 notify();
}
