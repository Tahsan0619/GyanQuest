/**
 * Backend Builder - Mission 3: Auth Lite (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L3_META = {
 objective: "By the end of this mission, you'll be able to explain who are you in your own words.",
 bdHook: "Bangladesh everyday: notice who are you around you - then connect it to Auth Lite.",
 predict: {
 q: "Before we start - what do you think matters most in Auth Lite?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Auth Lite",
 theme: "who are you",
 emoji: "\ud83d\udd11",
 rewardName: "Auth Guard",
 intro: "Login checks identity before private rooms open. Public pages can stay open.",
 everyday: ["School grades login", "Bank app PIN", "Family photo cloud"],
 subTitles: [
 "Meet the Gate",
 "Unlock Lab",
 "Sort Auth vs Public",
 "Stronger Check Lab",
 "Why Prove Who",
 "Name the Auth Rule",
 "Stretch: Real Logins",
 "Myth Bust",
 "Fluency Drill",
 "Auth Guard Mastery"
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
 setCoach("Hook: drag ID card and lock.");
 mountMotionChain(overlay, {
 title: "Meet the Gate",
 beats: [
 { scene: "authMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m3, "auth")}<p><strong>Act 1:</strong> Drag the ID card and the lock.</p>` },
 { scene: "authMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Check identity - then the private room can open.</p>` },
 { scene: "authMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Login first - then private data.</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "authMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "What should happen before private grades open?",
 opts: ["Prove who you are (login)", "Only paint the page", "Share your password with everyone", "Eat cake for auth"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "authMeet", badge: LAB_ASSET_PATHS.m3,
 html: `<h3>Gate ready</h3><p>Next: strengthen the identity check dial.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until the lock opens (>= 60%).");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "authLab", title: "Unlock Lab",
 html: `<p>Drag until identity check is strong enough (>= 60%).</p>`,
 goalText: "Goal >= 60%", doneLabel: "Gate checked", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Auth", badge: LAB_ASSET_PATHS.m3,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort auth checks, public pages, or not auth.");
 mountTapContinue(overlay, {
 scene: "authSort",
 html: `<h3>Guide</h3><p><strong>Auth:</strong> login, password, token, logout.<br><strong>Public:</strong> about, news.<br><strong>Not:</strong> cake, sock.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "authSort", title: "Sort Auth vs Public",
 instructions: "Drag into Auth / Public / Not auth.",
 successText: "Auth sorted!",
 chips: [
 { id: "login", text: "Login form", short: "Login", color: 0x22c55e },
 { id: "pass", text: "Password", short: "Password", color: 0x38bdf8 },
 { id: "token", text: "Session token", short: "Token", color: 0xfbbf24 },
 { id: "logout", text: "Logout", short: "Logout", color: 0xf97316 },
 { id: "about", text: "About page", short: "About page", color: 0xa78bfa },
 { id: "news", text: "Public news", short: "Public news", color: 0x4ade80 },
 { id: "cake", text: "Birthday cake", short: "Cake", color: 0xf472b6 },
 { id: "sock", text: "A sock", short: "Sock", color: 0x94a3b8 }
 ],
 zones: [
 { id: "auth", label: "Auth check", accept: ["login", "pass", "token", "logout"] },
 { id: "pub", label: "Public ok", accept: ["about", "news"] },
 { id: "not", label: "Not auth", accept: ["cake", "sock"] }
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push the identity check stronger.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "authLab", title: "Stronger Check Lab", html: `<p>Reach >= 75% - private room unlocks.</p>`,
 goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Auth", badge: LAB_ASSET_PATHS.m3,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why we prove who we are.");
 mountOrderSteps(overlay, {
 scene: "authMeet", sceneArgs: { phase: "settle" }, title: "Why Prove Who",
 instructions: "Order the story.",
 items: [
 { id: "ask", html: "App asks who you are" },
 { id: "proof", html: "You prove with password or PIN" },
 { id: "token", html: "Server gives a session token" },
 { id: "enter", html: "Private room opens" }
 ],
 correctIds: ["ask", "proof", "token", "enter"],
 onDone: () => mountQuiz(overlay, {
 scene: "authMeet", title: "Check",
 q: "Sharing your password is...",
 opts: ["Unsafe - keep it private", "Always required for friendship", "The same as CSS", "How socks authenticate"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the auth rule.");
 mountEquationBuild(overlay, {
 scene: "authRule", title: "Name the Auth Rule", instructions: "Tap in order.",
 tokens: [{ id: "a", html: "Prove" }, { id: "b", html: "who" }, { id: "c", html: "then" }, { id: "d", html: "enter" }],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "authRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Prove who you are - then private rooms open.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Home cloud, school, bank, bKash, lab.");
 mountTapContinue(overlay, {
 scene: "authStretch", html: `<h3>Real logins</h3><p>Tap each mode - same identity-check idea.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "authStretch", title: "Transfer",
 q: "A school grades page should...",
 opts: ["Check login before showing private scores", "Stay open to anyone forever", "Use cake as a password", "Ignore logout"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust auth myths.");
 mountMythCards(overlay, {
 scene: "authMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Public pages need your password", truth: "Public pages can open without login", sceneMyth: 0 },
 { claim: "Auth is only for banks", truth: "School portals and apps use auth too", sceneMyth: 1 },
 { claim: "Sharing your password is fine", truth: "Passwords stay private - never share", sceneMyth: 2 },
 { claim: "Logout does nothing", truth: "Logout ends the session so others cannot peek", sceneMyth: 3 },
 { claim: "Socks are login tokens", truth: "Tokens are digital proofs - not clothing", sceneMyth: 4 }
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick auth fluency.");
 mountSpeedDrill(overlay, {
 scene: "authDrill", title: "Fluency Drill", passScene: "authMastery",
 items: [
 { q: "Login proves identity?", opts: ["Yes", "No"], ok: 0, prompt: "Login" },
 { q: "Public news needs a password?", opts: ["No", "Yes"], ok: 0, prompt: "Public" },
 { q: "Should you share passwords?", opts: ["No", "Yes"], ok: 0, prompt: "Share" },
 { q: "Logout ends a session?", opts: ["Yes", "No"], ok: 0, prompt: "Logout" },
 { q: "Is cake an auth token?", opts: ["No", "Yes"], ok: 0, prompt: "Cake" },
 { q: "Private grades need auth?", opts: ["Yes", "Never"], ok: 0, prompt: "Grades" }
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Auth Guard.");
 mountOrderSteps(overlay, {
 scene: "authMastery", title: "Auth Guard Mastery", instructions: "Order your journey.",
 items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Guard" }],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "authMastery", badge: LAB_ASSET_PATHS.m3,
 html: `<h3>Auth Guard!</h3><p>You can explain prove-who-then-enter.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
