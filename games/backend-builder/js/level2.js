/**
 * Backend Builder - Mission 2: Routes & APIs (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
 objective: "By the end of this mission, you'll be able to explain paths & endpoints in your own words.",
 bdHook: "Bangladesh everyday: notice paths & endpoints around you - then connect it to Routes & APIs.",
 predict: {
 q: "Before we start - what do you think matters most in Routes & APIs?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Routes & APIs",
 theme: "paths & endpoints",
 emoji: "\ud83d\udee3\ufe0f",
 rewardName: "Route Ranger",
 intro: "URLs are doors. Each route path does a job - /users, /posts, /login.",
 everyday: ["Weather /forecast", "School /grades", "Shop /checkout"],
 subTitles: [
 "Meet Route Doors",
 "Open Routes Lab",
 "Sort Paths & Methods",
 "More Doors Lab",
 "Why Paths Matter",
 "Name the Route Rule",
 "Stretch: App Paths",
 "Myth Bust",
 "Fluency Drill",
 "Route Ranger Mastery"
 ],
};

export function runL2Sub(subIndex, api) {
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
 setCoach("Hook: drag /users /posts /login doors.");
 mountMotionChain(overlay, {
 title: "Meet Route Doors",
 beats: [
 { scene: "routesMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m2, "routes")}<p><strong>Act 1:</strong> Drag the route doors in the API hallway.</p>` },
 { scene: "routesMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Each path is an endpoint with a job.</p>` },
 { scene: "routesMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> URLs are doors - pick the right route.</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "routesMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "What is /users in an API?",
 opts: ["A route path with a job", "A sock", "Only a paint color", "A cake recipe"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "routesMeet", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>Hallway unlocked</h3><p>Next: open more route doors with the dial.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until more route doors open (>= 60%).");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "routesLab", title: "Open Routes Lab",
 html: `<p>Drag until route doors open (>= 60%).</p>`,
 goalText: "Goal >= 60%", doneLabel: "Routes open", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Routes", badge: LAB_ASSET_PATHS.m2,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort route paths, methods/status, or not API.");
 mountTapContinue(overlay, {
 scene: "routesSort",
 html: `<h3>Guide</h3><p><strong>Route:</strong> /users, /posts, /login.<br><strong>Method/status:</strong> GET, POST, 404.<br><strong>Not:</strong> paint, rice.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "routesSort", title: "Sort Paths & Methods",
 instructions: "Drag into Route / Method-status / Not API.",
 successText: "Routes sorted!",
 chips: [
 { id: "users", text: "/users path", short: "/users", color: 0x22c55e },
 { id: "posts", text: "/posts path", short: "/posts", color: 0x38bdf8 },
 { id: "login", text: "/login path", short: "/login", color: 0xfbbf24 },
 { id: "get", text: "GET method", short: "GET", color: 0x4ade80 },
 { id: "post", text: "POST method", short: "POST", color: 0xf97316 },
 { id: "404", text: "404 not found", short: "404", color: 0xef4444 },
 { id: "paint", text: "Paint can", short: "Paint", color: 0xa78bfa },
 { id: "rice", text: "Rice bowl", short: "Rice", color: 0x94a3b8 }
 ],
 zones: [
 { id: "route", label: "Route path", accept: ["users", "posts", "login"] },
 { id: "method", label: "Method / status", accept: ["get", "post", "404"] },
 { id: "not", label: "Not API", accept: ["paint", "rice"] }
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Open even more endpoint doors.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "routesLab", title: "More Doors Lab", html: `<p>Reach >= 75% - more doors light up.</p>`,
 goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Routes", badge: LAB_ASSET_PATHS.m2,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why paths matter.");
 mountOrderSteps(overlay, {
 scene: "routesMeet", sceneArgs: { phase: "settle" }, title: "Why Paths Matter",
 instructions: "Order the story.",
 items: [
 { id: "path", html: "Pick a clear path like /users" },
 { id: "job", html: "That path does one job" },
 { id: "method", html: "Method says read or send" },
 { id: "miss", html: "Wrong path can mean 404" }
 ],
 correctIds: ["path", "job", "method", "miss"],
 onDone: () => mountQuiz(overlay, {
 scene: "routesMeet", title: "Check",
 q: "A 404 usually means...",
 opts: ["That route was not found", "The server became rice", "CSS deleted itself", "Auth is always cake"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the route rule.");
 mountEquationBuild(overlay, {
 scene: "routesRule", title: "Name the Route Rule", instructions: "Tap in order.",
 tokens: [{ id: "a", html: "Path" }, { id: "b", html: "Job" }, { id: "c", html: "Method" }, { id: "d", html: "Door" }],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "routesRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Each route path is a door with a job.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Home, school, shop, BD ticket, lab paths.");
 mountTapContinue(overlay, {
 scene: "routesStretch", html: `<h3>App paths</h3><p>Tap each mode - same route-door idea.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "routesStretch", title: "Transfer",
 q: "A shop checkout still needs...",
 opts: ["Clear routes like /checkout", "Only paint cans", "Zero paths ever", "Rice as the only endpoint"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust route myths.");
 mountMythCards(overlay, {
 scene: "routesMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "Every URL is the same job", truth: "Each route path usually does one clear job", sceneMyth: 0 },
 { claim: "404 means the server melted", truth: "404 means that route was not found", sceneMyth: 1 },
 { claim: "GET and POST are just colors", truth: "Methods say how you ask (read vs send)", sceneMyth: 2 },
 { claim: "Routes are only for experts", truth: "Kids can learn /users as a door with a job", sceneMyth: 3 },
 { claim: "Rice is a valid API route", truth: "Routes are paths like /users - not food", sceneMyth: 4 }
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick routes fluency.");
 mountSpeedDrill(overlay, {
 scene: "routesDrill", title: "Fluency Drill", passScene: "routesMastery",
 items: [
 { q: "Is /users a route path?", opts: ["Yes", "No"], ok: 0, prompt: "/users" },
 { q: "404 means not found?", opts: ["Yes", "No"], ok: 0, prompt: "404" },
 { q: "GET is often a read?", opts: ["Yes", "No"], ok: 0, prompt: "GET" },
 { q: "Is rice an API path?", opts: ["No", "Yes"], ok: 0, prompt: "Rice" },
 { q: "Do different doors do different jobs?", opts: ["Yes", "Never"], ok: 0, prompt: "Jobs" },
 { q: "POST can send form data?", opts: ["Yes", "No"], ok: 0, prompt: "POST" }
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Route Ranger.");
 mountOrderSteps(overlay, {
 scene: "routesMastery", title: "Route Ranger Mastery", instructions: "Order your journey.",
 items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Route" }],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "routesMastery", badge: LAB_ASSET_PATHS.m2,
 html: `<h3>Route Ranger!</h3><p>You can explain why each API door has a job.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
