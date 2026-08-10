/**
 * Database & SQL - Mission 3: Keys & Joins (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L3_META = {
 objective: "By the end of this mission, you'll be able to explain linking tables in your own words.",
 bdHook: "Bangladesh everyday: notice linking tables around you - then connect it to Keys & Joins.",
 predict: {
 q: "Before we start - what do you think matters most in Keys & Joins?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Keys & Joins",
 theme: "linking tables",
 emoji: "\ud83d\udd17",
 rewardName: "Join Junior",
 intro: "Keys link tables so stories stay connected. JOIN matches key values across tables.",
 everyday: ["Student + class list", "Order + order items", "Ticket + seat"],
 subTitles: [
 "Meet Key Links",
 "Match Dial Lab",
 "Sort Keys & Joins",
 "Stronger Link Lab",
 "Why Keys Matter",
 "Name the Join Rule",
 "Stretch: Real Links",
 "Myth Bust",
 "Fluency Drill",
 "Join Junior Mastery"
 ],
};

export function runL3Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.25; labState.phase = "desk"; labState.mode = "home";
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: two tables - matching keys draw a link.");
 mountMotionChain(overlay, {
 title: "Meet Key Links",
 beats: [
 { scene: "joinMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m3, "join")}<p><strong>Act 1:</strong> See students and classes side by side.</p>` },
 { scene: "joinMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Matching keys draw a link between tables.</p>` },
 { scene: "joinMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Keys keep related stories connected.</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "joinMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "What links related rows across tables?",
 opts: ["Matching key values", "Glue sticks only", "Socks", "Random cake"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "joinMeet", badge: LAB_ASSET_PATHS.m3,
 html: `<h3>Link unlocked</h3><p>Next: strengthen the key match dial.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until the key match is clear (>= 60%).");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "joinLab", title: "Match Dial Lab",
 html: `<p>Drag until the join link is strong (>= 60%).</p>`,
 goalText: "Goal >= 60%", doneLabel: "Link checked", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Match", badge: LAB_ASSET_PATHS.m3,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort key fields, join actions, or not a link.");
 mountTapContinue(overlay, {
 scene: "joinSort",
 html: `<h3>Guide</h3><p><strong>Key:</strong> primary key, foreign key, id.<br><strong>Join:</strong> JOIN, ON match.<br><strong>Not:</strong> orphan row, glue, sock.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "joinSort", title: "Sort Keys & Joins",
 instructions: "Drag into Key / Join / Not a link.",
 successText: "Keys sorted!",
 chips: [
 { id: "pk", text: "Primary key", short: "Primary key", color: 0x22c55e },
 { id: "fk", text: "Foreign key", short: "Foreign key", color: 0x38bdf8 },
 { id: "id", text: "id field", short: "id", color: 0x2dd4bf },
 { id: "join", text: "JOIN keyword", short: "JOIN", color: 0xfbbf24 },
 { id: "on", text: "ON match", short: "ON match", color: 0x4ade80 },
 { id: "orphan", text: "Orphan row", short: "Orphan row", color: 0xf97316 },
 { id: "glue", text: "Glue stick", short: "Glue stick", color: 0xa78bfa },
 { id: "sock", text: "A sock", short: "Sock", color: 0x94a3b8 }
 ],
 zones: [
 { id: "key", label: "Key field", accept: ["pk", "fk", "id"] },
 { id: "join", label: "Join action", accept: ["join", "on"] },
 { id: "not", label: "Not a link", accept: ["orphan", "glue", "sock"] }
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Strengthen the key match further.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "joinLab", title: "Stronger Link Lab", html: `<p>Reach >= 75% - tables stay linked.</p>`,
 goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Match", badge: LAB_ASSET_PATHS.m3,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why keys matter.");
 mountOrderSteps(overlay, {
 scene: "joinMeet", sceneArgs: { phase: "settle" }, title: "Why Keys Matter",
 instructions: "Order the story.",
 items: [
 { id: "id", html: "Give each row a clear key" },
 { id: "store", html: "Store related keys in other tables" },
 { id: "match", html: "Match keys with JOIN ON" },
 { id: "story", html: "Read one connected story" }
 ],
 correctIds: ["id", "store", "match", "story"],
 onDone: () => mountQuiz(overlay, {
 scene: "joinMeet", title: "Check",
 q: "An orphan row often means...",
 opts: ["A missing key match breaks the link", "The database became a sock", "JOIN is banned forever", "Glue is required"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the join rule.");
 mountEquationBuild(overlay, {
 scene: "joinRule", title: "Name the Join Rule", instructions: "Tap in order.",
 tokens: [{ id: "a", html: "Key" }, { id: "b", html: "Match" }, { id: "c", html: "Join" }, { id: "d", html: "Link" }],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "joinRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Keys match - JOIN links related tables.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Home albums, school, shop, BD ticket, lab.");
 mountTapContinue(overlay, {
 scene: "joinStretch", html: `<h3>Real links</h3><p>Tap each mode - same key-join idea.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "joinStretch", title: "Transfer",
 q: "Student + class lists stay connected by...",
 opts: ["Matching keys (like class_id)", "Glue sticks only", "Ignoring ids forever", "Socks as primary keys"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust join myths.");
 mountMythCards(overlay, {
 scene: "joinMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Tables never need to link", truth: "Related stories use keys to stay connected", sceneMyth: 0 },
 { claim: "Any random number is a good key", truth: "Keys should uniquely identify a row", sceneMyth: 1 },
 { claim: "JOIN glues with tape", truth: "JOIN matches key values between tables", sceneMyth: 2 },
 { claim: "Orphan rows are fine forever", truth: "Missing key matches break the story link", sceneMyth: 3 },
 { claim: "Socks join tables", truth: "Keys and JOIN ON match fields - not socks", sceneMyth: 4 }
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick join fluency.");
 mountSpeedDrill(overlay, {
 scene: "joinDrill", title: "Fluency Drill", passScene: "joinMastery",
 items: [
 { q: "Do keys link related rows?", opts: ["Yes", "No"], ok: 0, prompt: "Keys" },
 { q: "Does JOIN match key values?", opts: ["Yes", "No"], ok: 0, prompt: "JOIN" },
 { q: "Is glue a SQL join?", opts: ["No", "Yes"], ok: 0, prompt: "Glue" },
 { q: "Can id be a primary key?", opts: ["Yes", "No"], ok: 0, prompt: "id" },
 { q: "Are orphan rows a broken link?", opts: ["Yes", "Never"], ok: 0, prompt: "Orphan" },
 { q: "Is a sock a foreign key?", opts: ["No", "Yes"], ok: 0, prompt: "Sock" }
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Join Junior.");
 mountOrderSteps(overlay, {
 scene: "joinMastery", title: "Join Junior Mastery", instructions: "Order your journey.",
 items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Join" }],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "joinMastery", badge: LAB_ASSET_PATHS.m3,
 html: `<h3>Join Junior!</h3><p>You can explain how keys join related tables.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
