/**
 * ICT Fundamentals boot - mission hub + Canvas 2D missions (Chem pattern).
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
import { playScene, cancelActiveActivity } from "./lab-activities.js?v=ictkitchen4";
import { runL1Sub, L1_META } from "./level1.js?v=ictkitchen4";
import { runL2Sub, L2_META } from "./level2.js?v=ioKitchen4";
import { runL3Sub, L3_META } from "./level3.js";
import { MISSIONS } from "./missions-meta.js";
import { mountMissionHub, mountSubRail } from "./mission-hub.js?v=tier3";
import { ensureMissionHubStyles, setMissionHubMode } from "/engine/js/mission-hub.js?v=tier3";
import { registerBitsScenes } from "./bits-scenes.js?v=ictkitchen4";
import { registerIoScenes } from "./io-scenes.js?v=ioKitchen4";
import { registerFilesScenes } from "./files-scenes.js";
import { BOOK as BOOK_L1 } from "../books/level1.js?v=genict1";
import { BOOK as BOOK_L2 } from "../books/level2.js?v=genict1";
import { BOOK as BOOK_L3 } from "../books/level3.js?v=book3";
import { setupMissionBooks } from "/engine/js/mission-books.js?v=ped1";


const N_LEVELS = 10;
const N_SUBS = 10;

export async function bootIctFundamentals({ manifest }) {

const BOOKS = [BOOK_L1, BOOK_L2, BOOK_L3];
let bookApi = { onBookClick() { console.warn("[books] unavailable"); } };
try {
 bookApi = setupMissionBooks({
 subject: manifest.title || "ict-fundamentals",
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

 await initI18n({ localeStorageKey: manifest.localeKey || "gq-ict-fundamentals-locale" });

 if (manifest.theme) {
 const root = document.documentElement;
 if (manifest.theme.accent) root.style.setProperty("--gq-accent", manifest.theme.accent);
 if (manifest.theme.accent2) root.style.setProperty("--gq-accent2", manifest.theme.accent2);
 }
 applyShellI18n(manifest);
 const coachName = document.querySelector(".coach-inline-name");
 if (coachName) coachName.textContent = manifest.coachName || "Coach Byte";
 const coachAv = document.querySelector(".coach-inline-avatar");
 if (coachAv) coachAv.textContent = manifest.emoji || "⚡";

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
 const storageKey = manifest.storageKey || "gq-ict-fundamentals-save-v2";

 if (!canvas) throw new Error("Missing #c3d canvas");

 const arena = createArena2D(canvas, { defaultScene: "bitsOpen" });
 window.__arena = arena;
 registerBitsScenes(arena);
 registerIoScenes(arena);
 registerFilesScenes(arena);

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
 const legacy = !saved ? loadSave("gq-ict-fundamentals-save-v1") : null;
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
 // Hard-clear play leftovers so hub cards are the only mission UI
 if (subRailHost) subRailHost.innerHTML = "";
 setMissionHubMode(true, { hubRoot, btnMissions, playChrome });
 if (hubRoot) hubRoot.classList.remove("hidden");
 if (playChrome) {
 playChrome.classList.add("hidden");
 playChrome.setAttribute("hidden", "");
 }
 mountMissionHub(hubRoot, {
 onBookClick: (idx, meta) => bookApi.onBookClick(idx, meta),
 gameTitle: manifest.title || "ICT Fundamentals",
 missions: MISSIONS,
 completed: state.completed,
 forceAllLocked: false,
 unlockByProgress: false,
 subtitle: "Missions 1-3 are live (Canvas 2D). Bits: Kitchen / Input & Output / Files & Folders.",
 onSelect: (idx) => enterMission(idx),
 onLockedClick: (idx) => {
 if (!MISSIONS[idx]?.playable) {
 showToast("Coming soon - this mission's labs are still being built.");
 } else {
 showToast("Finish the previous mission's 10 steps first.");
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
 if (hubRoot) hubRoot.classList.add("hidden");
 if (playChrome) {
 playChrome.classList.remove("hidden");
 playChrome.removeAttribute("hidden");
 }
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
 : `Mission ${state.level + 1} / ${meta.kidTitle}`;
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
 <button type="button" class="btn primary" id="ff-claim">Finish mission </button>
 <button type="button" class="btn secondary" id="ff-hub">☰ Missions</button>
 </div>`;
 overlay?.appendChild(card);
 card.querySelector("#ff-claim")?.addEventListener("click", () => finishMission());
 card.querySelector("#ff-hub")?.addEventListener("click", () => showHub());
 return;
 }
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
 ? ["bitsOpen", { dwellMs: 3200 }]
 : state.level === 1
 ? ["ioOpen", { dwellMs: 3200 }]
 : state.level === 2
 ? ["pairMeet", { phase: "desk", dwellMs: 3200 }]
 : ["bitsOpen", { dwellMs: 2400 }];
 playScene(introScene[0], introScene[1]);
 const bodyMeta = state.level === 0 ? L1_META : state.level === 1 ? L2_META : state.level === 2 ? L3_META : null;
 overlay.innerHTML = `
 <div class="chem-card chem-intro">
 <div class="lab-demo__badge">Mission ${state.level + 1}</div>
 <h2>${meta.emoji} ${meta.kidTitle}</h2>
 <p>${bodyMeta?.intro || meta.hook}</p>
 ${
 bodyMeta
 ? `<ul class="chem-intro__hooks">${bodyMeta.everyday.map((e) => `<li>${e}</li>`).join("")}</ul>
 <p class="chem-intro__brunner"><strong>Bruner path:</strong> do &amp; see → pictures → name the rule (4 spirals).</p>`
 : `<p>This mission's full labs are coming soon.</p>`
 }
 <button type="button" class="btn primary" id="ff-intro-go">Start </button>
 </div>`;
 overlay.querySelector("#ff-intro-go").onclick = () => {
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
 const winScene = state.level === 1 ? "ioSpiral" : state.level === 2 ? "pairMastery" : "bitsSpiral";
 playScene(winScene);
 if (overlay) {
 overlay.innerHTML = `
 <div class="chem-card">
 <h3>${meta.emoji} ${meta.kidTitle} complete!</h3>
 <p>You earned <strong>${meta.rewardName}</strong>.</p>
 <div class="btn-row">
 <button type="button" class="btn primary" id="ff-fin-hub">☰ All missions</button>
 <button type="button" class="btn secondary" id="ff-fin-replay">Replay step 1</button>
 </div>
 </div>`;
 overlay.querySelector("#ff-fin-hub")?.addEventListener("click", () => showHub());
 overlay.querySelector("#ff-fin-replay")?.addEventListener("click", () => {
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
 <button type="button" class="btn primary" id="ff-fin">Awesome</button>
 </div></div>`;
 document.getElementById("ff-fin").onclick = () => {
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
 state.sub = state.sub + 1;
 persist();
 runCurrent();
 }

 function runComingSoon() {
 clearOverlay();
 showNext(false);
 updateProgressUI();
 const meta = currentMeta();
 setCoach(`${meta.kidTitle} is on the path - live labs ship mission by mission.`);
 playScene("bitsOpen", { phase: "open" });
 overlay.innerHTML = `
 <div class="chem-card">
 <h3>${meta.emoji} ${meta.kidTitle}</h3>
 <p>${meta.hook}</p>
 <p><strong>Coming soon.</strong> Full interactive labs will match Lazy Rock quality.</p>
 <button type="button" class="btn primary" id="ff-soon-hub">☰ Back to missions</button>
 </div>`;
 overlay.querySelector("#ff-soon-hub").onclick = () => showHub();
 }

 function runCurrent() {
 const api = { overlay, setCoach, completeSub, registerTryAgain };
 if (state.level === 0) {
 clearOverlay();
 showNext(false);
 updateProgressUI();
 runL1Sub(state.sub, api);
 return;
 }
 if (state.level === 1) {
 clearOverlay();
 showNext(false);
 updateProgressUI();
 runL2Sub(state.sub, api);
 return;
 }
 if (state.level === 2) {
 clearOverlay();
 showNext(false);
 updateProgressUI();
 runL3Sub(state.sub, api);
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
 const hints = [
 [
 "Tap Open the Kitchen - watch the laptop wake up.",
 "Flip the 8 switches - watch binary and decimal update.",
 "Same pattern = number, letter, pixel - then bit and byte.",
 "Drag 3 and 5 to the chef, Execute, then speed up the slider.",
 "Watch the 4-step CPU loop, then read CPU / GHz terms.",
 "Fetch from counter (fast), pantry (slow), then Power Off.",
 "Compare speed vs permanence - RAM and storage names.",
 "Open a program - walk through 4 steps and see cramped-kitchen lag.",
 "Hover spec lines - RAM, SSD, CPU map to the kitchen.",
 "Closing zoom-out - open the spiral recap map.",
 ],
 [
 "Tap Open the Windows on the sealed kitchen.",
 "Type at sealed wall, cut order window with keyboard, type again.",
 "Input gallery - arrows in - then input device definition.",
 "Serve fails at sealed wall - drag monitor/speaker/printer out.",
 "Output gallery - arrows out - then output device definition.",
 "Tap touchscreen in+out, sort 6 devices into Input/Output/Both.",
 "Venn diagram - then I/O device definition.",
 "Run full cycle: input → chef/RAM/storage → output.",
 "Accessibility montage - braille, voice, rumble - summary.",
 "Closing - windows open both ways - spiral recap map.",
 ],
 [
 "Drag School/Photos folders and files.",
 "Fill the save bar into School/hw.txt.",
 "Sort files into School / Media / Rename.",
 "Save again to a higher goal.",
 "Order name -> folder -> save -> find.",
 "Tap the file rule pieces in order.",
 "Tap usb / cloud / phone / lab / home modes.",
 "Bust file myths on the cards.",
 "Hit the fluency checks.",
 "Order the journey and claim File Finder.",
 ],
 ];
 const row = hints[state.level] || hints[0];
 showToast(row[state.sub] || "Interact with the left canvas - it teaches the idea.");
 });
 btnResetAll?.addEventListener("click", () => {
 if (!confirm("Reset all ICT Fundamentals progress?")) return;
 clearSave(storageKey);
 clearSave("gq-ict-fundamentals-save-v1");
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

 document.documentElement.classList.add("ictfundament-live", "chem-l1-live");

 // QA jump helper (_qa-jump.html) may set sessionStorage to resume mid-mission.
 const qaJump = typeof sessionStorage !== "undefined" && sessionStorage.getItem("gq-qa-jump") === "1";
 if (qaJump) {
 try {
 sessionStorage.removeItem("gq-qa-jump");
 } catch (_) {}
 resumePlaySession();
 } else {
 // Always open the mission levels hub first (do not auto-resume mid-mission).
 showHub();
 }
}
