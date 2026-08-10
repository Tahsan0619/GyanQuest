/**
 * Shared pedagogy layer for all Canvas boot-l1 games.
 *
 * Step 0 scenario decisions (do not re-derive):
 * - book-chat.js: A (UI + live POST /api/chat) → extend same path for Features 2 & 6.
 * - groq_proxy.py: A (POST /api/chat) → reuse; add optional `tier` body field only.
 * - digital-book.js / book-unlock.js / mission-books.js: C (page-turn + unlock exist)
 * + D (terms already linked via linkTerms) → only extend chat open path, not unlock/pages.
 * - concept-viz.js: B-ish - file IS used for chem overlay demos; ADD constellation exports
 * without replacing mountConceptViz (minimal/additive branch).
 */
import {
 soloTierFromStars,
 canEnterMastery,
 normalizeFluencyScores,
 normalizePredictions,
 normalizeStreaks,
 normalizeHintTiers,
 normalizeConceptLog,
} from "/engine/js/persist.js?v=resume1";
import { openBookChat } from "/engine/js/book-chat.js?v=chatfix2";
import { openConstellation, pickRecallTerms } from "/engine/js/concept-viz.js?v=ped3";

const PED_CSS = "/engine/css/pedagogy.css?v=ped1";

function ensureCss() {
 if (document.querySelector('link[data-gq-ped-css]')) return;
 const link = document.createElement("link");
 link.rel = "stylesheet";
 link.href = PED_CSS;
 link.dataset.gqPedCss = "1";
 document.head.appendChild(link);
}

function escapeHtml(s) {
 return String(s ?? "")
 .replace(/&/g, "&amp;")
 .replace(/</g, "&lt;")
 .replace(/>/g, "&gt;")
 .replace(/"/g, "&quot;");
}

/**
 * @param {{
 * getState: () => object,
 * persist: () => void,
 * setCoach?: (html: string) => void,
 * showToast?: (msg: string) => void,
 * subject?: string,
 * nLevels?: number,
 * }} opts
 */
export function wirePedagogy(opts) {
 ensureCss();
 const nLevels = opts.nLevels || 10;
 const state = opts.getState();
 // Additive normalize on live state object (old saves lack fields).
 state.fluencyScores = normalizeFluencyScores(state.fluencyScores, nLevels);
 state.predictions = normalizePredictions(state.predictions, nLevels);
 state.streaks = normalizeStreaks(state.streaks);
 state.hintTiers = normalizeHintTiers(state.hintTiers);
 state.conceptLog = normalizeConceptLog(state.conceptLog);

 const api = {
 canEnterMastery: (levelIdx) => canEnterMastery(opts.getState(), levelIdx),

 setFluencyScore(ratio) {
 const s = opts.getState();
 const lv = s.level;
 const r = typeof ratio === "number" ? ratio : 0;
 s.fluencyScores[lv] = Math.max(s.fluencyScores[lv] || 0, r);
 opts.persist();
 },

 /** Flow Autopilot v1 - streak only; no content-swap adaptive difficulty yet. */
 recordAnswer(correct) {
 const s = opts.getState();
 if (correct) {
 s.streaks.correct = (s.streaks.correct || 0) + 1;
 s.streaks.wrong = 0;
 if (s.streaks.correct >= 3) {
 opts.setCoach?.("You're on a roll - nice streak!");
 flashRollBadge();
 }
 } else {
 s.streaks.wrong = (s.streaks.wrong || 0) + 1;
 s.streaks.correct = 0;
 if (s.streaks.wrong >= 2) {
 opts.setCoach?.(
 "Here's a simpler take: slow down, eliminate one wrong option, then try again.",
 );
 }
 }
 opts.persist();
 },

 applySoloToReward(levelIdx, stars = 3) {
 const s = opts.getState();
 if (!s.rewards[levelIdx]) s.rewards[levelIdx] = { earned: false, stars: 0, tier: null };
 s.rewards[levelIdx].earned = true;
 s.rewards[levelIdx].stars = stars;
 s.rewards[levelIdx].tier = soloTierFromStars(stars);
 opts.persist();
 return s.rewards[levelIdx];
 },

 /**
 * Pre-mission: recall → objective compass → predict → then().
 * Skips silently when fields absent (STUB / unfinished META).
 */
 runPreMission(getMeta, then) {
 const meta = typeof getMeta === "function" ? getMeta() : getMeta;
 const s = opts.getState();
 const afterRecall = () => showObjective(meta, () => showPredict(meta, s, opts, then));
 const recalls = pickRecallTerms(s.conceptLog, 3);
 if (recalls.length) showRecall(recalls, afterRecall);
 else afterRecall();
 },

 noteSubComplete(levelIdx, subIdx) {
 // Fluency is sub index 8; completing it after drill pass implies >=80%.
 if (subIdx === 8) {
 const s = opts.getState();
 if ((s.fluencyScores[levelIdx] || 0) < 0.8) {
 s.fluencyScores[levelIdx] = 0.8;
 opts.persist();
 }
 }
 if (subIdx === 9) {
 showReflect(opts, levelIdx);
 }
 },

 guardGoNext(goNextFn) {
 return function guardedGoNext() {
 const s = opts.getState();
 const next = s.sub + 1;
 if (next === 9 && !canEnterMastery(s, s.level)) {
 opts.showToast?.("Pass the fluency drill (80%+) before Mastery.");
 opts.setCoach?.("Mastery is locked until fluency hits 80%.");
 return;
 }
 return goNextFn();
 };
 },

 showConstellation() {
 openConstellation(opts.getState().conceptLog || []);
 },
 };

 window.__gqPed = api;
 return api;
}

function flashRollBadge() {
 let el = document.getElementById("gq-roll-badge");
 if (!el) {
 el = document.createElement("div");
 el.id = "gq-roll-badge";
 el.className = "gq-ped-roll";
 document.body.appendChild(el);
 }
 el.textContent = "On a roll!";
 el.classList.add("gq-ped-roll--show");
 setTimeout(() => el.classList.remove("gq-ped-roll--show"), 1600);
}

function showRecall(terms, then) {
 ensureCss();
 const host = overlayHost();
 const card = document.createElement("div");
 card.className = "gq-ped-card";
 card.innerHTML = `
 <p class="gq-ped-card__eyebrow">Quick recall</p>
 <h3>Remember these?</h3>
 <ul>${terms.map((t) => `<li><strong>${escapeHtml(t.term)}</strong> <span>(${escapeHtml(t.subject || "")})</span></li>`).join("")}</ul>
 <button type="button" class="btn primary" id="gq-ped-recall-go">Continue</button>`;
 host.appendChild(card);
 card.querySelector("#gq-ped-recall-go").onclick = () => {
 card.remove();
 then?.();
 };
}

function showObjective(meta, then) {
 if (!meta?.objective) {
 then?.();
 return;
 }
 ensureCss();
 const host = overlayHost();
 const card = document.createElement("div");
 card.className = "gq-ped-card";
 card.innerHTML = `
 <p class="gq-ped-card__eyebrow">Objective compass</p>
 <h3>${escapeHtml(meta.kidTitle || "Mission")}</h3>
 <p class="gq-ped-card__obj">${escapeHtml(meta.objective)}</p>
 ${meta.bdHook ? `<p class="gq-ped-card__bd">${escapeHtml(meta.bdHook)}</p>` : ""}
 <p class="gq-ped-card__coach" id="gq-ped-narrate">Coach: ${escapeHtml(
 meta.bdHook || meta.objective,
 )}</p>
 <button type="button" class="btn primary" id="gq-ped-obj-go">Got it</button>`;
 host.appendChild(card);
 // Feature 8: text narration only (voice.js follow-up).
 card.querySelector("#gq-ped-obj-go").onclick = () => {
 card.remove();
 then?.();
 };
}

function showPredict(meta, state, opts, then) {
 const pred = meta?.predict;
 if (!pred || !Array.isArray(pred.options) || !pred.options.length) {
 then?.();
 return;
 }
 ensureCss();
 const host = overlayHost();
 const card = document.createElement("div");
 card.className = "gq-ped-card";
 card.innerHTML = `
 <p class="gq-ped-card__eyebrow">Predict</p>
 <h3>${escapeHtml(pred.q || "What do you think happens?")}</h3>
 <div class="gq-ped-opts">
 ${pred.options
 .map(
 (o, i) =>
 `<button type="button" class="btn secondary gq-ped-opt" data-i="${i}">${escapeHtml(o)}</button>`,
 )
 .join("")}
 </div>`;
 host.appendChild(card);
 card.querySelectorAll(".gq-ped-opt").forEach((btn) => {
 btn.onclick = () => {
 const i = Number(btn.dataset.i);
 state.predictions[state.level] = i;
 opts.persist();
 card.remove();
 then?.();
 };
 });
}

function showReflect(opts, levelIdx) {
 const s = opts.getState();
 const meta = null; // filled via coach text only if prediction exists
 const predIdx = s.predictions?.[levelIdx];
 if (predIdx === null || predIdx === undefined) return;
 // Soft coach note - full card uses overlay if available.
 opts.setCoach?.(
 `Reflect: your early prediction was option ${Number(predIdx) + 1}. Compare it to the rule you named in this mission.`,
 );
 const host = overlayHost();
 if (!host) return;
 const card = document.createElement("div");
 card.className = "gq-ped-card gq-ped-card--reflect";
 card.innerHTML = `
 <p class="gq-ped-card__eyebrow">Predict → Reflect</p>
 <h3>What you thought vs what you know</h3>
 <p>Your prediction: option <strong>${Number(predIdx) + 1}</strong>.</p>
 <p>What you know now: re-read the mission rule step - you can teach it in one clear sentence.</p>
 <button type="button" class="btn primary" id="gq-ped-ref-go">Continue</button>`;
 host.appendChild(card);
 card.querySelector("#gq-ped-ref-go").onclick = () => card.remove();
}

function overlayHost() {
 return document.getElementById("overlay") || document.body;
}

/** Open tiered term explain (Features 2+6) via existing book-chat path only. */
export function explainTermTier(opts) {
 openBookChat({
 term: opts.term,
 subject: opts.subject,
 buildThenReveal: true,
 tiered: true,
 bookFigure: opts.bookFigure || null,
 level: opts.level,
 onExplained: opts.onExplained,
 });
}
