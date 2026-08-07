/**
 * Backend Builder - Mission 1: Server Basics (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain request response in your own words.",
  bdHook: "Bangladesh everyday: notice request response around you — then connect it to Server Basics.",
  predict: {
    q: "Before we start — what do you think matters most in Server Basics?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

 kidTitle: "Server Basics",
 theme: "request response",
 emoji: "\ud83d\udce1",
 rewardName: "Server Scout",
 intro: "A client asks. A server answers. Request goes in - response comes back.",
 everyday: ["Phone weather app", "School portal login page", "Shop checkout order"],
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
  "Server Scout Mastery"
 ],
};

export function runL1Sub(subIndex, api) {
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
 setCoach("Hook: phone asks, rack answers - drag both.");
 mountMotionChain(overlay, {
  title: "Meet Client & Server",
  beats: [
   { scene: "serverMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
    html: `${badgeHtml(LAB_ASSET_PATHS.m1, "server")}<p><strong>Act 1:</strong> Drag the phone (client) and the server rack.</p>` },
   { scene: "serverMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
    html: `<p><strong>Act 2:</strong> Watch REQ fly out and RES come back.</p>` },
   { scene: "serverMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
    html: `<p><strong>Act 3:</strong> A request goes in - a response comes back.</p>` },
  ],
  onDone: () => mountQuiz(overlay, {
   scene: "serverMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
   q: "Who usually answers a client request?",
   opts: ["The server", "Only a sock", "Only CSS paint", "A cake shop always"],
   ok: 0, onDone: () => mountTapContinue(overlay, {
    scene: "serverMeet", badge: LAB_ASSET_PATHS.m1,
    html: `<h3>Loop unlocked</h3><p>Next: strengthen the request/response dial.</p>`,
    onDone: completeSub, advanceAfterDone: true,
   }),
  }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until the REQ/RES loop is clear (>= 60%).");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
  scene: "serverLab", title: "Request Loop Lab",
  html: `<p>Drag until the request/response loop looks clear (>= 60%).</p>`,
  goalText: "Goal >= 60%", doneLabel: "Loop checked", threshold: 0.6, startHeat: 0.25,
  axis: "x", canvasAction: "stretch", sliderLabel: "Clarity", badge: LAB_ASSET_PATHS.m1,
  onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort request pieces, responses, or not-server.");
 mountTapContinue(overlay, {
  scene: "serverSort",
  html: `<h3>Guide</h3><p><strong>Request:</strong> GET, POST, JSON.<br><strong>Response:</strong> 200 OK, 500 error.<br><strong>Not:</strong> color:red, cake, sock.</p>`,
  onDone: () => mountDragSort(overlay, {
   scene: "serverSort", title: "Sort REQ / RES",
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
    { id: "sock", text: "A sock", short: "Sock", color: 0x94a3b8 }
   ],
   zones: [
    { id: "req", label: "Request", accept: ["get", "post", "json"] },
    { id: "res", label: "Response", accept: ["ok", "err"] },
    { id: "not", label: "Not server", accept: ["css", "cake", "sock"] }
   ],
   onDone: completeSub,
  }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push the loop stronger on the dial.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
  scene: "serverLab", title: "Stronger Loop Lab", html: `<p>Reach >= 75% clarity on the request/response path.</p>`,
  goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
  axis: "x", canvasAction: "stretch", sliderLabel: "Clarity", badge: LAB_ASSET_PATHS.m1,
  onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why the browser waits.");
 mountOrderSteps(overlay, {
  scene: "serverMeet", sceneArgs: { phase: "settle" }, title: "Why Wait for RES",
  instructions: "Order the story.",
  items: [
   { id: "ask", html: "Client sends a request" },
   { id: "work", html: "Server does the work" },
   { id: "reply", html: "Server sends a response" },
   { id: "show", html: "Client shows the result" }
  ],
  correctIds: ["ask", "work", "reply", "show"],
  onDone: () => mountQuiz(overlay, {
   scene: "serverMeet", title: "Check",
   q: "If the server never replies, the app usually...",
   opts: ["Waits or shows an error", "Paints CSS forever", "Becomes a sock", "Deletes the internet"],
   ok: 0, onDone: completeSub,
  }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the server rule.");
 mountEquationBuild(overlay, {
  scene: "serverRule", title: "Name the Server Rule", instructions: "Tap in order.",
  tokens: [{ id: "a", html: "Request" }, { id: "b", html: "in" }, { id: "c", html: "Response" }, { id: "d", html: "out" }],
  correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
  onDone: () => mountTapContinue(overlay, {
   scene: "serverRule", badge: LAB_ASSET_PATHS.rule,
   html: `<h3>Rule locked</h3><p>Request in, response out - that is the server loop.</p>`,
   onDone: completeSub, advanceAfterDone: true,
  }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Home app, school portal, shop, BD ticket, lab.");
 mountTapContinue(overlay, {
  scene: "serverStretch", html: `<h3>Real apps</h3><p>Tap each mode - same request/response idea.</p>`,
  onDone: () => mountQuiz(overlay, {
   scene: "serverStretch", title: "Transfer",
   q: "A BD ticket app still needs...",
   opts: ["A request to a server and a response back", "Only socks and cake", "Zero responses ever", "Only paint with no data"],
   ok: 0, onDone: completeSub,
  }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust server myths.");
 mountMythCards(overlay, {
  scene: "serverMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
  myths: [
   { claim: "The browser is the server", truth: "Browser is the client - server answers elsewhere", sceneMyth: 0 },
   { claim: "Servers only send pretty colors", truth: "Servers send data and status - CSS is look", sceneMyth: 1 },
   { claim: "A request never needs a response", truth: "Useful apps wait for a response (or a clear error)", sceneMyth: 2 },
   { claim: "Only experts can learn this", truth: "Kids can learn client asks, server answers", sceneMyth: 3 },
   { claim: "Cake is a valid HTTP response", truth: "Responses are status and data - not snacks", sceneMyth: 4 }
  ],
  onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick server fluency.");
 mountSpeedDrill(overlay, {
  scene: "serverDrill", title: "Fluency Drill", passScene: "serverMastery",
  items: [
   { q: "Client sends the request?", opts: ["Yes", "No"], ok: 0, prompt: "Client" },
   { q: "Server answers with a response?", opts: ["Yes", "No"], ok: 0, prompt: "Server" },
   { q: "Is color:red mainly a server reply?", opts: ["No", "Yes"], ok: 0, prompt: "CSS" },
   { q: "200 OK is a response status?", opts: ["Yes", "No"], ok: 0, prompt: "200" },
   { q: "Should apps ignore all errors?", opts: ["No", "Yes"], ok: 0, prompt: "Errors" },
   { q: "Sock is a request body?", opts: ["No", "Yes"], ok: 0, prompt: "Sock" }
  ],
  onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Server Scout.");
 mountOrderSteps(overlay, {
  scene: "serverMastery", title: "Server Scout Mastery", instructions: "Order your journey.",
  items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Serve" }],
  correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
  onDone: () => mountTapContinue(overlay, {
   scene: "serverMastery", badge: LAB_ASSET_PATHS.m1,
   html: `<h3>Server Scout!</h3><p>You can explain request in and response out.</p>`,
   onDone: completeSub, advanceAfterDone: true,
  }),
 });
}
