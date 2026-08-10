/**
 * Voice narration player - plays level/sub audio alongside on-screen text.
 * Paths: /audio/<gameId>/<locale>/l01-intro.wav | l01-s01.wav | l01-quiz.wav
 */
let current = null;
let unlocked = false;

function pad2(n) {
 return String(n).padStart(2, "0");
}

export function voiceKey(levelIndex, kind, subIndex = 0) {
 const L = pad2(levelIndex + 1);
 if (kind === "intro") return `l${L}-intro`;
 if (kind === "quiz") return `l${L}-quiz`;
 return `l${L}-s${pad2(subIndex + 1)}`;
}

export function voiceUrl(gameId, locale, key) {
 const loc = locale === "bn" ? "bn" : "en";
 return `/audio/${gameId}/${loc}/${key}.wav`;
}

export function stopVoice() {
 stopBrowserSpeech();
 if (current) {
 try {
 current.pause();
 current.src = "";
 } catch {
 /* ignore */
 }
 current = null;
 }
 syncButtons(false);
}

function syncButtons(playing) {
 document.querySelectorAll("[data-voice-btn]").forEach((btn) => {
 btn.classList.toggle("is-playing", playing);
 btn.setAttribute("aria-pressed", playing ? "true" : "false");
 const label = btn.querySelector("[data-voice-label]");
 if (label) label.textContent = playing ? "Stop" : "Listen";
 });
}

let browserUtterance = null;

function stopBrowserSpeech() {
 try {
 if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
 } catch {
 /* ignore */
 }
 browserUtterance = null;
}

function speakBrowser(text, locale) {
 if (!text || typeof speechSynthesis === "undefined") return Promise.resolve(false);
 stopBrowserSpeech();
 return new Promise((resolve) => {
 const u = new SpeechSynthesisUtterance(text);
 u.lang = locale === "bn" ? "bn-BD" : "en-US";
 u.rate = 0.95;
 browserUtterance = u;
 u.onend = () => {
 if (browserUtterance === u) browserUtterance = null;
 syncButtons(false);
 resolve(true);
 };
 u.onerror = () => {
 if (browserUtterance === u) browserUtterance = null;
 syncButtons(false);
 resolve(false);
 };
 syncButtons(true);
 unlocked = true;
 try {
 speechSynthesis.speak(u);
 } catch {
 syncButtons(false);
 resolve(false);
 }
 });
}

/** TEMP: mute WAV + TTS while Chemistry Lab animations are authored. Flip to false to restore. */
export const VOICE_MUTED = true;

/**
 * Play narration for a clip. Prefers /audio WAV; falls back to browser TTS.
 * @returns {Promise<boolean>} true if playback started
 */
export function playVoice(gameId, locale, key, speakText = "") {
 stopVoice();
 if (VOICE_MUTED) return Promise.resolve(false);
 if (!key && !speakText) return Promise.resolve(false);
 const url = gameId && key ? voiceUrl(gameId, locale, key) : null;
 if (!url) return speakBrowser(speakText, locale);

 const audio = new Audio();
 audio.preload = "auto";
 current = audio;

 return new Promise((resolve) => {
 let settled = false;
 const failToBrowser = () => {
 if (settled) return;
 settled = true;
 if (current === audio) current = null;
 if (speakText) {
 speakBrowser(speakText, locale).then(resolve);
 } else {
 syncButtons(false);
 resolve(false);
 }
 };

 audio.onended = () => {
 if (current === audio) {
 current = null;
 syncButtons(false);
 }
 };
 audio.onerror = failToBrowser;
 audio.src = url;
 audio
 .play()
 .then(() => {
 if (settled) return;
 settled = true;
 unlocked = true;
 syncButtons(true);
 resolve(true);
 })
 .catch(failToBrowser);
 });
}

export function toggleVoice(gameId, locale, key, speakText = "") {
 if ((current && !current.paused) || browserUtterance) {
 stopVoice();
 return Promise.resolve(false);
 }
 return playVoice(gameId, locale, key, speakText);
}

/** Mount a Listen button next to the coach row (idempotent). */
export function ensureVoiceButton(host, { gameId, locale, getKey, getText, onPlay }) {
 if (!host) return null;
 let btn = host.querySelector("[data-voice-btn]");
 if (!btn) {
 btn = document.createElement("button");
 btn.type = "button";
 btn.className = "btn secondary voice-btn";
 btn.dataset.voiceBtn = "1";
 btn.title = "Listen to this step";
 btn.innerHTML = `<span aria-hidden="true">🔊</span> <span data-voice-label>Listen</span>`;
 host.prepend(btn);
 }
 btn.onclick = () => {
 const key = typeof getKey === "function" ? getKey() : getKey;
 const text = typeof getText === "function" ? getText() : getText || "";
 if (!key && !text) return;
 toggleVoice(gameId, locale, key, text).then((started) => {
 if (started && typeof onPlay === "function") onPlay(key);
 });
 };
 return btn;
}

/** Strip HTML for display captions under coach (keeps text visible). */
export function plainTextFromHtml(html) {
 if (!html) return "";
 const d = document.createElement("div");
 d.innerHTML = String(html);
 return (d.textContent || "").replace(/\s+/g, " ").trim();
}

export function showVoiceCaption(el, text) {
 if (!el) return;
 const t = (text || "").trim();
 if (!t) {
 el.hidden = true;
 el.textContent = "";
 return;
 }
 el.hidden = false;
 el.textContent = t;
}

export function isVoicePlaying() {
 return Boolean(current && !current.paused);
}

export function markVoiceUnlocked() {
 unlocked = true;
}

export function wasVoiceUnlocked() {
 return unlocked;
}
