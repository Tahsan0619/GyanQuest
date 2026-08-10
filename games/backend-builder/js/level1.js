/**
 * Backend Builder - Mission 1: Server Basics
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Target: 45-60 minutes. Accurate: client, server, request, response, status.
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain,
 mountDragSort,
 mountHeatLab,
 mountEquationBuild,
 mountQuiz,
 mountSpeedDrill,
 mountMythCards,
 mountTapContinue,
 mountOrderSteps,
 mountRevealSteps,
 mountScaleLab,
 mountMultiQuiz,
 playScene,
 badgeHtml,
} from "./lab-activities.js";

const LOOP_READOUTS = {
 cold: "Quiet - no clear REQ yet",
 melting: "Request forming…",
 liquid: "REQ flying - waiting on RES",
 simmer: "Loop clear - response linked",
};

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain request response in your own words.",
 bdHook: "Bangladesh everyday: notice request response around you - then connect it to Server Basics.",
 predict: {
 q: "Before we start - what do you think matters most in Server Basics?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Server Basics",
 theme: "request response",
 emoji: "📡",
 rewardName: "Server Scout",
 intro:
 "A client asks. A server answers. Request goes in - response comes back with data and a status.",
 everyday: [
 "Phone weather app",
 "School portal login page",
 "Shop checkout order",
 ],
 subTitles: [
 "Meet Client & Server",
 "Request Loop Lab",
 "Sort REQ / RES",
 "Stronger Loop Lab",
 "Why Wait for RES",
 "Name the Server Rule",
 "Stretch: Real Apps",
 "Myth Bust",
 "Fluency Drill",
 "Server Scout Mastery",
 ],
};

/**
 * @param {{
 * overlay: HTMLElement,
 * setCoach: (html: string, aside?: string) => void,
 * completeSub: () => void,
 * registerTryAgain: (fn: () => void) => void,
 * }} api
 */
export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false;
 labState.tokenProgress = 0;
 labState.masteryStep = 0;
 labState.sortPlaced = 0;
 labState.placed = {};
 labState.selectedId = null;
 labState.mythBusted = false;
 labState.mythPhase = "claim";
 labState.scale = 0;
 labState.heat = 0.25;
 labState.phase = "desk";
 labState.mode = "home";
 labState.prompt = "Server drill!";

 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 fn(api);
 });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook + light enactive: drag the phone (client) and rack (server) - watch REQ fly out and RES return.");
 mountMotionChain(overlay, {
 title: "Meet Client & Server",
 beats: [
 {
 scene: "serverMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "server")}
 <p><strong>Act 1 - Everyday ask:</strong> Drag the phone (client) and the server rack on the canvas.</p>
 <p>Your weather app is a client. The machine that answers lives elsewhere.</p>`,
 },
 {
 scene: "serverMeet",
 sceneArgs: { phase: "glow" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Packets move:</strong> Watch <strong>REQ</strong> fly toward the rack and <strong>RES</strong> come back.</p>
 <p>That two-way trip is the core server loop - not magic paint on the screen.</p>`,
 },
 {
 scene: "serverMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4200,
 html: `<p><strong>Act 3 - Big idea:</strong> A request goes in - a response comes back with data and a status.</p>
 <p>Phone apps, school portals, and shop checkouts all ride this ask/answer loop.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "serverMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "Who usually answers a client request?",
 opts: [
 "The server",
 "Only a sock",
 "Only CSS paint",
 "A cake shop always",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "serverMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met Client & Server</h3><p>Next we dial the request/response loop until it looks clear.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Enactive: dial Clarity until the REQ/RES loop looks clear (>= 60%). Drag the orange handle on the canvas too.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "serverLab",
 title: "Request Loop Lab",
 html: `<p>Drag until the <strong>request/response</strong> loop looks clear (>= 60%).</p>
 <p>Use the slider, +/−, or drag the orange handle on the canvas.</p>`,
 goalText: "Goal: clarity >= 60% so REQ and RES are clearly linked.",
 doneLabel: "Loop checked",
 threshold: 0.6,
 startHeat: 0.25,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Clarity",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: LOOP_READOUTS,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Enactive sort: requests ask, responses answer, CSS/cake/sock are not the server loop.");
 mountTapContinue(overlay, {
 scene: "serverSort",
 html: `<h3>Request vs response vs not</h3>
 <p><strong>Request:</strong> GET, POST, JSON body - what the client asks.</p>
 <p><strong>Response:</strong> 200 OK, 500 error - status + data back.</p>
 <p><strong>Not server:</strong> color:red (look), cake, sock.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "serverSort",
 title: "Sort REQ / RES",
 instructions: "Drag into Request / Response / Not server.",
 successText: "Server sorted!",
 chips: [
 { id: "get", text: "GET a page", short: "GET page", color: 0x22c55e },
 { id: "post", text: "POST a form", short: "POST form", color: 0x38bdf8 },
 { id: "json", text: "JSON body", short: "JSON body", color: 0xfbbf24 },
 { id: "ok", text: "200 OK reply", short: "200 OK", color: 0x4ade80 },
 { id: "err", text: "500 error reply", short: "500 error", color: 0xf97316 },
 { id: "css", text: "A CSS color", short: "color:red", color: 0xa78bfa },
 { id: "cake", text: "Birthday cake", short: "Cake", color: 0xf472b6 },
 { id: "sock", text: "A sock", short: "Sock", color: 0x94a3b8 },
 ],
 zones: [
 { id: "req", label: "Request", accept: ["get", "post", "json"] },
 { id: "res", label: "Response", accept: ["ok", "err"] },
 { id: "not", label: "Not server", accept: ["css", "cake", "sock"] },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "serverSort",
 title: "Justify",
 q: "Why is color:red NOT a server response?",
 opts: [
 "It is CSS look styling - not status + data from a server",
 "Because red is an illegal color",
 "Because only GET can use colors",
 "Because socks own all colors",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push the loop stronger - watch 200 OK appear when the path is clear.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "serverLab",
 title: "Stronger Loop Lab",
 html: `<p>Reach >= 75% clarity so the request/response path is rock-solid.</p>
 <p>When the loop is clear, the canvas shows a <strong>200 OK</strong> status badge.</p>`,
 goalText: "Goal: clarity >= 75%.",
 doneLabel: "Lab done",
 threshold: 0.75,
 startHeat: 0.4,
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Clarity",
 badge: LAB_ASSET_PATHS.m1,
 readoutLabels: LOOP_READOUTS,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "serverLab",
 title: "Status check",
 q: "A 200 OK on the canvas means…",
 opts: [
 "The server answered successfully with a status",
 "The browser painted CSS forever",
 "Cake arrived as the response body",
 "The client became the server",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Explain: why the browser waits - order ask → work → reply → show.");
 mountOrderSteps(overlay, {
 scene: "serverMeet",
 sceneArgs: { phase: "settle" },
 title: "Why Wait for RES",
 instructions: "Order the story.",
 items: [
 { id: "ask", html: "Client sends a request" },
 { id: "work", html: "Server does the work" },
 { id: "reply", html: "Server sends a response" },
 { id: "show", html: "Client shows the result" },
 ],
 correctIds: ["ask", "work", "reply", "show"],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "serverMeet",
 sceneArgs: { phase: "glow" },
 title: "Causal chain",
 steps: [
 "Client sends a request (ask) across the network.",
 "Server receives it and does the work (lookup, save, compute).",
 "Server sends a response with status + data (or a clear error).",
 "Client paints the result - or shows a wait/error if no RES arrives.",
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "serverMeet",
 title: "Check",
 q: "If the server never replies, the app usually…",
 opts: [
 "Waits or shows an error",
 "Paints CSS forever",
 "Becomes a sock",
 "Deletes the internet",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Symbolic: build Request → in → Response → out, then scrub phone → packets → rule banner.");
 mountEquationBuild(overlay, {
 scene: "serverRule",
 title: "Name the Server Rule",
 instructions: "Tap tokens in order to build the Server Basics rule.",
 tokens: [
 { id: "a", html: "Request" },
 { id: "b", html: "in" },
 { id: "c", html: "Response" },
 { id: "d", html: "out" },
 ],
 correctIds: ["a", "b", "c", "d"],
 badge: LAB_ASSET_PATHS.rule,
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "serverRule",
 title: "Server scale scrubber",
 html: `<p>Slide from everyday phone + rack → REQ/RES packets → the locked rule banner.</p>
 <p>The Server Basics rule is <strong>request in, response out</strong>.</p>`,
 start: 0.05,
 threshold: 0.85,
 sliderLabel: "Server scale: desk → packets → REQUEST IN / RESPONSE OUT",
 goalText: "Left canvas: phone desk → flying packets → green rule banner.",
 readoutLabels: {
 low: "Desk: client phone + server rack",
 mid: "Packets: REQ out, RES back",
 high: "Rule: REQUEST IN · RESPONSE OUT",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "serverRule",
 title: "Rule check",
 q: "What is the main Server Basics rule?",
 opts: [
 "Request goes in - response comes out",
 "Browsers are always the server",
 "Servers only send CSS colors",
 "Cake is a valid HTTP status",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Transfer: same request/response idea in home, school, shop, BD ticket, and API lab.");
 const modes = [
 {
 mode: "home",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "home")}<p><strong>Home:</strong> Weather app on the phone sends GET /wx - cloud replies with JSON forecast.</p>`,
 },
 {
 mode: "school",
 html: `<p><strong>School:</strong> Browser asks the portal for grades - server returns 200 OK with data.</p>`,
 },
 {
 mode: "shop",
 html: `<p><strong>Shop:</strong> Cart posts an order - server answers with order #42 confirmation.</p>`,
 },
 {
 mode: "bd",
 html: `<p><strong>BD ticket:</strong> Ticket / bKash-style app still uses the same request → response loop.</p>`,
 },
 {
 mode: "lab",
 html: `<p><strong>API lab:</strong> Terminal sends GET /api/ping and reads <code>200 { ok: true }</code>.</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "serverStretch",
 sceneArgs: { mode: "bd" },
 title: "Transfer",
 q: "A BD ticket app still needs…",
 opts: [
 "A request to a server and a response back",
 "Only socks and cake",
 "Zero responses ever",
 "Only paint with no data",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "serverStretch",
 sceneArgs: { mode: m.mode },
 html: `<div class="lab-demo__badge">Context ${step + 1} of ${modes.length}</div>${m.html}`,
 onDone: () => {
 step++;
 show();
 },
 });
 }
 show();
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth (and diagram) appears after you bust the myth.");
 mountMythCards(overlay, {
 scene: "serverMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“The browser is the server”",
 claim: "The browser is the server",
 truth: "Browser is the client - server answers elsewhere",
 },
 {
 sceneMyth: 1,
 title: "“Servers only send pretty colors”",
 claim: "Servers only send pretty colors",
 truth: "Servers send data and status - CSS is look",
 },
 {
 sceneMyth: 2,
 title: "“A request never needs a response”",
 claim: "A request never needs a response",
 truth: "Useful apps wait for a response (or a clear error)",
 },
 {
 sceneMyth: 3,
 title: "“Only experts can learn this”",
 claim: "Only experts can learn request/response",
 truth: "Kids can learn client asks, server answers",
 },
 {
 sceneMyth: 4,
 title: "“Cake is a valid HTTP response”",
 claim: "Cake is a valid HTTP response",
 truth: "Responses are status and data - not snacks",
 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick application checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "serverDrill",
 title: "Fluency Drill",
 passScene: "serverMastery",
 passRatio: 0.8,
 items: [
 { q: "Client sends the request?", opts: ["Yes", "No"], ok: 0, prompt: "Client" },
 { q: "Server answers with a response?", opts: ["Yes", "No"], ok: 0, prompt: "Server" },
 { q: "Is color:red mainly a server reply?", opts: ["No", "Yes"], ok: 0, prompt: "CSS color" },
 { q: "200 OK is a response status?", opts: ["Yes", "No"], ok: 0, prompt: "200 OK" },
 { q: "Should apps ignore all errors?", opts: ["No", "Yes"], ok: 0, prompt: "Errors" },
 { q: "Sock is a request body?", opts: ["No", "Yes"], ok: 0, prompt: "Sock" },
 {
 q: "Best Server Basics rule?",
 opts: ["Request in, response out", "Browser is always the server", "Only CSS matters", "Skip all errors"],
 ok: 0,
 prompt: "Request",
 },
 {
 q: "Which is a response?",
 opts: ["200 OK reply", "GET a page", "color:red", "A sock"],
 ok: 0,
 prompt: "Status",
 },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to weather + portal, then prove it.");
 playScene("serverMastery");
 mountOrderSteps(overlay, {
 scene: "serverMastery",
 title: "Server Scout Mastery - learning path",
 instructions: "Tap Bruner order: meet → sort → lab → rule → stretch/myths.",
 items: [
 { id: "1", html: "Meet client & server (concrete)" },
 { id: "2", html: "Sort request vs response" },
 { id: "3", html: "Dial the REQ/RES loop (do it)" },
 { id: "4", html: "Name request-in / response-out" },
 { id: "5", html: "Stretch + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "serverMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Weather + school portal:</strong> Phone weather GETs forecast JSON; portal browser asks for grades and waits for 200 OK - same ask/answer family, different apps.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "serverMastery",
 title: "Final mastery",
 doneTitle: "Server Scout ready",
 items: [
 {
 q: "Weather apps, portals, and shop checkouts all teach the same idea because…",
 opts: [
 "They use a client request and a server response",
 "They are unrelated magic tricks",
 "Only weather apps talk to servers",
 "Responses are always cake",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about client vs server is…",
 opts: [
 "The browser is usually the client; the server answers elsewhere",
 "The browser is always the server",
 "Servers only send CSS colors",
 "Clients never send requests",
 ],
 ok: 0,
 },
 {
 q: "Which belongs in “not server”?",
 opts: ["A sock", "200 OK", "GET a page", "JSON body"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "serverMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from concrete phone + rack to a reusable rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Server Scout</strong>.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
 },
 });
}
