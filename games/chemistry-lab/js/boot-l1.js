/**
 * Chemistry Lab boot - mission hub + Mission 1 Tiny Bits (Canvas 2D).
 * Playground removed. Sub-rail sequential locks. 10×10 save shape.
 */
import { initI18n, setLocale, getLocale, applyShellI18n } from "/engine/js/i18n.js";
import {
 loadSave,
 saveGame,
 clearSave,
 normalizeCompleted,
 normalizeIntroSeen,
 normalizeRewards,
 normalizeFluencyScores,
 normalizePredictions,
 normalizeStreaks,
 normalizeHintTiers,
 normalizeConceptLog,
 levelDoneCount,
 REWARD_ICONS,
} from "/engine/js/persist.js?v=resume1";
import { createArena2D } from "./arena-2d.js";
import { registerAtomScenes } from "./atom-scenes.js";
import { playScene, cancelActiveActivity } from "./chem-activities.js?v=elemhunt6";
import { runL1Sub, L1_META } from "./level1.js";
import { runL2Sub, L2_META } from "./level2.js?v=elemhunt3";
import { runL3Sub, L3_META } from "./level3.js?v=bond1";
import { MISSIONS } from "./missions-meta.js";
import { mountMissionHub, mountSubRail } from "./mission-hub.js?v=tier3";
import { ensureMissionHubStyles, setMissionHubMode } from "/engine/js/mission-hub.js?v=tier3";
import { registerElementScenes } from "./element-scenes.js?v=elemhunt1";
import { registerBondScenes } from "./bond-scenes.js?v=bond1";
import { BOOK as BOOK_L1 } from "../books/level1.js?v=book4";
import { BOOK as BOOK_L2 } from "../books/level2.js?v=book4";
import { BOOK as BOOK_L3 } from "../books/level3.js?v=book4";
import { setupMissionBooks } from "/engine/js/mission-books.js?v=ped1";


const N_LEVELS = 10;
const N_SUBS = 10;

export async function bootChemLevel1({ manifest }) {

const BOOKS = [BOOK_L1, BOOK_L2, BOOK_L3];
let bookApi = { onBookClick() { console.warn("[books] unavailable"); } };
try {
 bookApi = setupMissionBooks({
 subject: manifest.title || "chemistry-lab",
 getBook: (i) => BOOKS[i] || null,
 getLevel: () => state.level,
 showToast: (msg) => {
 const toastRoot = document.getElementById("toast-root");
 if (!toastRoot) return;
 toastRoot.innerHTML = `<div class="toast">${msg}</div>`;
 setTimeout(() => { toastRoot.innerHTML = ""; }, 2200);
 },
});
} catch (err) {
 console.warn("[books] disabled:", err);
}

 await initI18n({ localeStorageKey: manifest.localeKey || "gq-chemistry-lab-locale" });

 if (manifest.theme) {
 const root = document.documentElement;
 if (manifest.theme.accent) root.style.setProperty("--gq-accent", manifest.theme.accent);
 if (manifest.theme.accent2) root.style.setProperty("--gq-accent2", manifest.theme.accent2);
 }
 applyShellI18n(manifest);
 const coachName = document.querySelector(".coach-inline-name");
 if (coachName) coachName.textContent = manifest.coachName || "Coach Molecule";
 const coachAv = document.querySelector(".coach-inline-avatar");
 if (coachAv) coachAv.textContent = manifest.emoji || "⚗️";

 const hubRoot = document.getElementById("mission-hub-root");
 const playChrome = document.getElementById("play-chrome");
 const canvas = document.getElementById("c3d");
 const overlay = document.getElementById("overlay");
 const coachText = document.getElementById("coach-text");
 const coachActions = document.getElementById("coach-actions");
 const levelTitle = document.getElementById("level-title");
 const subRailHost = document.getElementById("sub-rail-host");
 const scoresEl = document.getElementById("scores");
 const btnHint = document.getElementById("btn-hint");
 const btnTryAgain = document.getElementById("btn-try-again");
 const btnNext = document.getElementById("btn-next");
 const btnNextDock = document.getElementById("btn-next-dock");
 const toastRoot = document.getElementById("toast-root");
 const modalRoot = document.getElementById("modal-root");
 const progressFill = document.getElementById("progress-fill");
 const progressLabel = document.getElementById("progress-label");
 const progressBar = document.querySelector(".progress-bar");
 const rewardSlot = document.getElementById("reward-slot");
 const btnResetAll = document.getElementById("btn-reset-all");
 const langSelect = document.getElementById("lang-select");
 const labDepth = document.getElementById("lab-depth");
 const btnMissions = document.getElementById("btn-missions");
 const btnTogglePanel = document.getElementById("btn-toggle-panel");
 const playDock = document.getElementById("play-dock");
 const storageKey = manifest.storageKey || "gq-chemistry-lab-save-v2";

 if (!canvas) throw new Error("Missing #c3d canvas");

 const arena = createArena2D(canvas, { defaultScene: "atomsMeet" });
 window.__arena = arena;
 registerAtomScenes(arena);
 registerElementScenes(arena);
 registerBondScenes(arena);

 let raf = 0;
 function loop() {
 raf = requestAnimationFrame(loop);
 arena.tick();
 }
 raf = requestAnimationFrame(loop);
 window.addEventListener("resize", () => arena.resize());
 if (typeof ResizeObserver !== "undefined") {
 const ro = new ResizeObserver(() => arena.resize());
 const vp = document.getElementById("viewport");
 if (vp) ro.observe(vp);
 }

 const state = {
 level: 0,
 sub: 0,
 inHub: true,
 completed: normalizeCompleted(null, N_LEVELS, N_SUBS),
 introSeen: normalizeIntroSeen(null, N_LEVELS),
 rewards: normalizeRewards(null, N_LEVELS),
 fluencyScores: normalizeFluencyScores(null, N_LEVELS),
 predictions: normalizePredictions(null, N_LEVELS),
 streaks: normalizeStreaks(null),
 hintTiers: normalizeHintTiers(null),
 conceptLog: normalizeConceptLog(null),
 };
 const saved = loadSave(storageKey);
 // Migrate old v1 1×10 saves into slot 0 of 10×10
 const legacy = !saved ? loadSave("gq-chemistry-lab-save-v1") : null;
 const src = saved || legacy;
 if (src) {
 state.level = Math.min(N_LEVELS - 1, Math.max(0, src.level ?? 0));
 state.sub = Math.min(N_SUBS - 1, Math.max(0, src.sub ?? 0));
 state.completed = normalizeCompleted(src.completed, N_LEVELS, N_SUBS);
 state.rewards = normalizeRewards(src.rewards, N_LEVELS);
 state.introSeen = normalizeIntroSeen(src.introSeen, N_LEVELS);
 state.fluencyScores = normalizeFluencyScores(src.fluencyScores, N_LEVELS);
 state.predictions = normalizePredictions(src.predictions, N_LEVELS);
 state.streaks = normalizeStreaks(src.streaks);
 state.hintTiers = normalizeHintTiers(src.hintTiers);
 state.conceptLog = normalizeConceptLog(src.conceptLog);
 // false = was in a mission; missing/true = hub (old saves).
 state.inHub = src.inHub !== false;
 }

 let tryAgainHandler = null;

 function persist() {
 saveGame(storageKey, state);
 }

 function setCoach(html, actionsHtml = "") {
 if (coachText) coachText.innerHTML = html;
 if (coachActions) coachActions.innerHTML = actionsHtml || "";
 }

 function clearOverlay() {
 cancelActiveActivity();
 if (overlay) overlay.innerHTML = "";
 }

 function showNext(v) {
 btnNext?.classList.toggle("hidden", !v);
 btnNextDock?.classList.toggle("hidden", !v);
 }

 function showToast(msg) {
 if (!toastRoot) return;
 toastRoot.innerHTML = `<div class="toast">${msg}</div>`;
 setTimeout(() => {
 toastRoot.innerHTML = "";
 }, 2200);
 }


 // Pedagogy is optional: dynamic import so a ped failure cannot blank the hub.
 let ped = {
 runPreMission(_getMeta, then) {
 then?.();
 },
 noteSubComplete() {},
 guardGoNext(fn) {
 return fn;
 },
 applySoloToReward(levelIdx, stars = 3) {
 if (!state.rewards[levelIdx]) state.rewards[levelIdx] = { earned: false, stars: 0, tier: null };
 state.rewards[levelIdx].earned = true;
 state.rewards[levelIdx].stars = stars;
 state.rewards[levelIdx].tier = stars >= 3 ? "relational" : stars >= 2 ? "multistructural" : "unistructural";
 persist();
 return state.rewards[levelIdx];
 },
 };


 function showHub() {
 state.inHub = true;
 persist();
 ensureMissionHubStyles();
 clearOverlay();
 cancelActiveActivity();
 setMissionHubMode(true, { hubRoot, btnMissions, playChrome });
 mountMissionHub(hubRoot, {
 onBookClick: (idx, meta) => bookApi.onBookClick(idx, meta),
 gameTitle: manifest.title || "Chemistry Lab",
 missions: MISSIONS,
 completed: state.completed,
 forceAllLocked: false,
 // Live missions (playable:true) open freely; "Soon" cards stay gated by playable flag.
 unlockByProgress: false,
 subtitle: "Missions 1-3 are live. Finish Tiny Bits → Element Hunt → Bond Buddies at your pace.",
 onSelect: (idx) => enterMission(idx),
 onLockedClick: (idx) => {
 if (!MISSIONS[idx]?.playable) {
 showToast("Coming soon - this mission’s labs are still being built.");
 } else {
 showToast("Finish the previous mission’s 10 steps first.");
 }
 },
 });
 requestAnimationFrame(() => {
 hubRoot?.scrollTo?.({ top: 0 });
 });
 }

 function showPlay() {
 state.inHub = false;
 persist();
 setMissionHubMode(false, { hubRoot, btnMissions, playChrome });
 requestAnimationFrame(() => arena.resize());
 }

 function currentMeta() {
 return MISSIONS[state.level] || MISSIONS[0];
 }

 function updateProgressUI() {
 const meta = currentMeta();
 const doneInLevel = levelDoneCount(state.completed, state.level);
 const left = N_SUBS - doneInLevel;
 const titles =
 state.level === 0
 ? L1_META.subTitles
 : state.level === 1
 ? L2_META.subTitles
 : state.level === 2
 ? L3_META.subTitles
 : Array.from({ length: 10 }, (_, i) => `Step ${i + 1}`);
 const title = titles[state.sub] || meta.kidTitle;

 if (levelTitle) {
 levelTitle.textContent = `Step ${state.sub + 1}/10 · ${title}`;
 }
 if (progressBar) {
 progressBar.setAttribute("aria-valuenow", String(doneInLevel));
 progressBar.setAttribute("aria-valuemin", "0");
 progressBar.setAttribute("aria-valuemax", String(N_SUBS));
 }
 if (progressFill) progressFill.style.width = `${(doneInLevel / N_SUBS) * 100}%`;
 if (progressLabel) {
 progressLabel.textContent =
 doneInLevel >= N_SUBS ? "Mission complete!" : `${left} step${left === 1 ? "" : "s"} left`;
 }
 if (scoresEl) {
 const rw = state.rewards[state.level];
 scoresEl.textContent = rw?.earned
 ? `${REWARD_ICONS[state.level] || "🏅"} ${meta.rewardName}`
 : `Mission ${state.level + 1} · ${meta.kidTitle}`;
 }
 if (labDepth) {
 const depthMeta =
 state.level === 0
 ? L1_META
 : state.level === 1
 ? typeof L2_META !== "undefined"
 ? L2_META
 : null
 : state.level === 2
 ? typeof L3_META !== "undefined"
 ? L3_META
 : null
 : null;
 if (depthMeta) {
 const hook = (depthMeta.everyday && depthMeta.everyday[0]) || depthMeta.kidTitle || "";
 const topic = depthMeta.theme || depthMeta.kidTitle || "mission";
 labDepth.textContent = hook
 ? `Today: ${topic} | Example: ${hook}`
 : `Today: ${topic}`;
 } else {
 labDepth.textContent = `Mission ${state.level + 1}: ${meta.theme} | Coming soon`;
 }
 }
 if (rewardSlot) {
 rewardSlot.textContent = state.rewards[state.level]?.earned
 ? `${REWARD_ICONS[state.level] || "🏅"} ${meta.rewardName}`
 : "";
 }

 if (subRailHost) {
 mountSubRail(subRailHost, {
 titles,
 level: state.level,
 sub: state.sub,
 completed: state.completed,
 onJump: (i) => {
 const row = state.completed[state.level] || [];
 const unlocked = i === state.sub || row[i] || i === 0 || row[i - 1];
 if (!unlocked) return;
 state.sub = i;
 persist();
 showNext(false);
 runCurrent();
 },
 });
 }
 }

 function completeSub() {
 state.completed[state.level][state.sub] = true;
 ped.noteSubComplete(state.level, state.sub);
 persist();
 updateProgressUI();
 showNext(true);
 if (state.sub >= N_SUBS - 1 && levelDoneCount(state.completed, state.level) >= N_SUBS) {
 const card = document.createElement("div");
 card.className = "chem-card chem-finish-cta";
 card.innerHTML = `
 <h3>All 10 steps complete</h3>
 <p>Claim your badge, return to missions, or replay a step from the rail.</p>
 <div class="btn-row">
 <button type="button" class="btn primary" id="chem-claim">Finish mission ▶</button>
 <button type="button" class="btn secondary" id="chem-hub">☰ Missions</button>
 </div>`;
 overlay?.appendChild(card);
 card.querySelector("#chem-claim")?.addEventListener("click", () => finishMission());
 card.querySelector("#chem-hub")?.addEventListener("click", () => showHub());
 return;
 }
 // Advance between sub-levels automatically once the completion action succeeds.
 requestAnimationFrame(() => {
 btnNextDock?.click();
 });
 }

 function registerTryAgain(fn) {
 tryAgainHandler = fn;
 }

 function openIntro(then) {
 if (state.introSeen[state.level]) {
 then();
 return;
 }
 clearOverlay();
 const meta = currentMeta();
 const introScene =
 state.level === 0
 ? ["atomsMeet", { phase: "zoom", dwellMs: 3200 }]
 : state.level === 1
 ? ["elemMeet", { phase: "shelf", dwellMs: 3200 }]
 : state.level === 2
 ? ["bondMeet", { dwellMs: 3200 }]
 : ["atomsMeet", { phase: "settle", dwellMs: 2400 }];
 playScene(introScene[0], introScene[1]);
 overlay.innerHTML = `
 <div class="chem-card chem-intro">
 <div class="lab-demo__badge">Mission ${state.level + 1}</div>
 <h2>${meta.emoji} ${meta.kidTitle}</h2>
 <p>${
 state.level === 0
 ? L1_META.intro
 : state.level === 1
 ? L2_META.intro
 : state.level === 2
 ? L3_META.intro
 : meta.hook
 }</p>
 ${
 state.level === 0
 ? `<ul class="chem-intro__hooks">${L1_META.everyday.map((e) => `<li>${e}</li>`).join("")}</ul>
 <p class="chem-intro__brunner"><strong>Bruner path:</strong> do &amp; see → pictures → name the rule.</p>`
 : state.level === 1
 ? `<ul class="chem-intro__hooks">${L2_META.everyday.map((e) => `<li>${e}</li>`).join("")}</ul>
 <p class="chem-intro__brunner"><strong>Bruner path:</strong> hunt samples → sort → name the element rule.</p>`
 : state.level === 2
 ? `<ul class="chem-intro__hooks">${L3_META.everyday.map((e) => `<li>${e}</li>`).join("")}</ul>
 <p class="chem-intro__brunner"><strong>Bruner path:</strong> attract &amp; snap → water buddies → name the bond rule.</p>`
 : `<p>This mission’s full labs are coming soon.</p>`
 }
 <button type="button" class="btn primary" id="chem-intro-go">Start ▶</button>
 </div>`;
 overlay.querySelector("#chem-intro-go").onclick = () => {
 state.introSeen[state.level] = true;
 persist();
 then();
 };
 }

 function finishMission() {
 if (levelDoneCount(state.completed, state.level) < N_SUBS) {
 showToast("Finish all 10 steps first.");
 return;
 }
 const meta = currentMeta();
 ped.applySoloToReward(state.level, 3);
 persist();
 updateProgressUI();
 showNext(false);
 clearOverlay();
 const winScene =
 state.level === 1 ? "elemMastery" : state.level === 2 ? "bondMastery" : "atomsMastery";
 playScene(winScene);
 if (overlay) {
 overlay.innerHTML = `
 <div class="chem-card">
 <h3>${meta.emoji} ${meta.kidTitle} complete!</h3>
 <p>You earned <strong>${meta.rewardName}</strong>.</p>
 <div class="btn-row">
 <button type="button" class="btn primary" id="chem-fin-hub">☰ All missions</button>
 <button type="button" class="btn secondary" id="chem-fin-replay">Replay step 1</button>
 </div>
 </div>`;
 overlay.querySelector("#chem-fin-hub")?.addEventListener("click", () => showHub());
 overlay.querySelector("#chem-fin-replay")?.addEventListener("click", () => {
 state.sub = 0;
 persist();
 runCurrent();
 });
 }
 if (modalRoot) {
 modalRoot.setAttribute("aria-hidden", "false");
 modalRoot.innerHTML = `
 <div class="modal-backdrop"><div class="modal chem-card" role="dialog" aria-modal="true">
 <h3>${meta.emoji} Mission complete!</h3>
 <p>You earned <strong>${meta.rewardName}</strong>.</p>
 <button type="button" class="btn primary" id="chem-fin">Awesome</button>
 </div></div>`;
 document.getElementById("chem-fin").onclick = () => {
 modalRoot.setAttribute("aria-hidden", "true");
 modalRoot.innerHTML = "";
 };
 }
 }

 function goNext() {
 showNext(false);
 if (state.sub >= N_SUBS - 1) {
 finishMission();
 return;
 }
 // Only advance into unlocked next sub
 const next = state.sub + 1;
 if (!state.completed[state.level][state.sub] && next > state.sub) {
 // completed current via completeSub before Next is shown
 }
 state.sub = next;
 persist();
 runCurrent();
 }

 function runComingSoon() {
 clearOverlay();
 showNext(false);
 updateProgressUI();
 const meta = currentMeta();
 setCoach(`${meta.kidTitle} is on the path - live labs ship mission by mission.`);
 const preview =
 state.level === 1 ? "elemMeet" : state.level === 2 ? "bondMeet" : "atomsMeet";
 playScene(preview, { phase: state.level === 1 ? "shelf" : "settle" });
 overlay.innerHTML = `
 <div class="chem-card">
 <h3>${meta.emoji} ${meta.kidTitle}</h3>
 <p>${meta.hook}</p>
 <p><strong>Coming soon.</strong> Full interactive labs will match Tiny Bits quality.</p>
 <button type="button" class="btn primary" id="chem-soon-hub">☰ Back to missions</button>
 </div>`;
 overlay.querySelector("#chem-soon-hub").onclick = () => showHub();
 }

 function runCurrent() {
 if (state.level === 0) {
 clearOverlay();
 showNext(false);
 updateProgressUI();
 runL1Sub(state.sub, {
 overlay,
 setCoach,
 completeSub,
 registerTryAgain,
 });
 return;
 }
 if (state.level === 1) {
 clearOverlay();
 showNext(false);
 updateProgressUI();
 runL2Sub(state.sub, {
 overlay,
 setCoach,
 completeSub,
 registerTryAgain,
 });
 return;
 }
 if (state.level === 2) {
 clearOverlay();
 showNext(false);
 updateProgressUI();
 runL3Sub(state.sub, {
 overlay,
 setCoach,
 completeSub,
 registerTryAgain,
 });
 return;
 }
 runComingSoon();
 }


 function resumePlaySession() {
 showPlay();
 persist();
 if (!MISSIONS[state.level]?.playable) {
 runComingSoon();
 return;
 }
 // Reload should land on the same step - skip predict/recall gates.
 if (state.introSeen[state.level]) runCurrent();
 else openIntro(runCurrent);
 }

 function enterMission(idx) {
 if (!MISSIONS[idx]?.playable) {
 state.level = idx;
 state.sub = 0;
 persist();
 showPlay();
 runComingSoon();
 return;
 }
 const sameMission = state.level === idx;
 state.level = idx;
 if (!sameMission) state.sub = 0;
 persist();
 showPlay();
 ped.runPreMission(() => currentMeta(), () => openIntro(runCurrent));
 }


 try {
 const { wirePedagogy } = await import("/engine/js/pedagogy.js?v=ped3");
 ped = wirePedagogy({
 getState: () => state,
 persist,
 setCoach,
 showToast,
 subject: manifest.title || document.title,
 nLevels: N_LEVELS,
 });
 } catch (err) {
 console.warn("[pedagogy] disabled:", err);
 }
 window.__gqGetState = () => state;
 window.__gqPersist = persist;

 btnNext?.addEventListener("click", ped.guardGoNext(goNext));
 btnNextDock?.addEventListener("click", ped.guardGoNext(goNext));
 btnTryAgain?.addEventListener("click", () => {
 showNext(false);
 clearOverlay();
 tryAgainHandler?.();
 });
 btnHint?.addEventListener("click", () => {
 const l1 = [
 "Drag the salt shaker and grain on the canvas - watch the story respond.",
 "Salt’s cube is an ordered Na⁺ / Cl⁻ ionic lattice - not one giant atom.",
 "Drag cards on the canvas into Matter vs Not matter zones.",
 "Drag the orange heat handle or use +/− until ice becomes settled liquid.",
 "Steam = fastest H₂O molecules escaping the pan (same substance).",
 "Build the rule, then scrub scale: grain → ions → optional shells.",
 "Drag stretch objects; pencil tip holds the graphite layers.",
 "Claim first - bust the myth to reveal the truth on the canvas.",
 "Score about 80% on the drill; retry if needed.",
 "Order: meet → sort → melt/steam → rule → stretch/myths.",
 ];
 const l2 = [
 "Drag the yellow magnifier over Fe / Cu / O₂ bottles - particles match that sample.",
 "Tap the iron lattice to pack more Fe atoms - all the same kind.",
 "Sort into Element, Compound, or Mixture - three zones.",
 "Stretch the copper wire; atom kind stays Cu.",
 "Tap O₂ pairs - still element oxygen (one atom kind).",
 "Build: One kind of atom makes an ELEMENT.",
 "Tap gold, foil, charcoal, helium, graphite - same rule, new objects.",
 "Bust myths about water, air, salt, rust, and O₂.",
 "Hit about 80% on the element drill.",
 "Order the Element Hunt path, then finish the Scout checks.",
 ];
 const l3 = [
 "Tap lonely atoms A and B so a bond link appears.",
 "Drag opposite magnets closer - attraction buddy feel.",
 "Sort into Bonded molecule, Attraction buddy, or No chemical bond.",
 "Slide until magnets click (≥ 75%) - snap glow.",
 "Tap water models - H-O-H bonded buddies.",
 "Build: Atoms link with BONDS as buddies.",
 "Walk salt, O₂, sugar, plastic, protein - same bond idea.",
 "Bust myths: glue, fridge magnets, mixtures, breaking, solids-only.",
 "Hit about 80% on the bond drill.",
 "Order the Bond Buddies path, then finish Explorer checks.",
 ];
 const hints = state.level === 2 ? l3 : state.level === 1 ? l2 : l1;
 showToast(hints[state.sub] || "Interact with the left canvas - it teaches the idea.");
 });
 btnResetAll?.addEventListener("click", () => {
 if (!confirm("Reset all Chemistry Lab progress?")) return;
 clearSave(storageKey);
 clearSave("gq-chemistry-lab-save-v1");
 state.level = 0;
 state.sub = 0;
 state.completed = normalizeCompleted(null, N_LEVELS, N_SUBS);
 state.introSeen = normalizeIntroSeen(null, N_LEVELS);
 state.rewards = normalizeRewards(null, N_LEVELS);
 persist();
 showHub();
 });
 langSelect?.addEventListener("change", () => setLocale(langSelect.value));
 if (langSelect) langSelect.value = getLocale();

 btnTogglePanel?.addEventListener("click", () => {
 playDock?.classList.toggle("is-collapsed");
 document.querySelector(".stage")?.classList.toggle("stage--dock-collapsed");
 requestAnimationFrame(() => arena.resize());
 });

 btnMissions?.addEventListener("click", () => showHub());

 document.documentElement.classList.add("chem-l1-live");

 // Always open the mission levels hub first (do not auto-resume mid-mission).
 showHub();
}
