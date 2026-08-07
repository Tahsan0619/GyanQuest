/**
 * Database & SQL - Mission 2: SELECT Stories (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L2_META = {
  objective: "By the end of this mission, you'll be able to explain query basics in your own words.",
  bdHook: "Bangladesh everyday: notice query basics around you — then connect it to SELECT Stories.",
  predict: {
    q: "Before we start — what do you think matters most in SELECT Stories?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

 kidTitle: "SELECT Stories",
 theme: "query basics",
 emoji: "\ud83d\udd0e",
 rewardName: "Query Kid",
 intro: "Ask the table with SELECT. FROM picks the table; WHERE filters the story.",
 everyday: ["Find contacts in Dhaka", "List class 5 names", "Show items in stock"],
 subTitles: [
  "Meet SELECT",
  "Filter Dial Lab",
  "Sort Ask vs Write",
  "Sharper Query Lab",
  "Why WHERE Helps",
  "Name the SELECT Rule",
  "Stretch: Real Questions",
  "Myth Bust",
  "Fluency Drill",
  "Query Kid Mastery"
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
 setCoach("Hook: SELECT asks; WHERE filters.");
 mountMotionChain(overlay, {
  title: "Meet SELECT",
  beats: [
   { scene: "selectMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
    html: `${badgeHtml(LAB_ASSET_PATHS.m2, "select")}<p><strong>Act 1:</strong> Start a SELECT - ask the table a question.</p>` },
   { scene: "selectMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
    html: `<p><strong>Act 2:</strong> Pick columns - name FROM kids.</p>` },
   { scene: "selectMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
    html: `<p><strong>Act 3:</strong> WHERE city filters the story.</p>` },
  ],
  onDone: () => mountQuiz(overlay, {
   scene: "selectMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
   q: "What does SELECT mainly do?",
   opts: ["Ask/read rows from a table", "Always delete the table", "Paint CSS only", "Bake cake"],
   ok: 0, onDone: () => mountTapContinue(overlay, {
    scene: "selectMeet", badge: LAB_ASSET_PATHS.m2,
    html: `<h3>Query unlocked</h3><p>Next: sharpen the SELECT filter dial.</p>`,
    onDone: completeSub, advanceAfterDone: true,
   }),
  }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until the filter finds a clear answer (>= 60%).");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
  scene: "selectLab", title: "Filter Dial Lab",
  html: `<p>Drag until SELECT/WHERE clarity >= 60%.</p>`,
  goalText: "Goal >= 60%", doneLabel: "Query checked", threshold: 0.6, startHeat: 0.25,
  axis: "x", canvasAction: "stretch", sliderLabel: "Filter", badge: LAB_ASSET_PATHS.m2,
  onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort ask/SELECT vs write/change vs not SQL.");
 mountTapContinue(overlay, {
  scene: "selectSort",
  html: `<h3>Guide</h3><p><strong>Ask:</strong> SELECT, FROM, WHERE, ORDER BY.<br><strong>Write:</strong> INSERT, UPDATE.<br><strong>Not:</strong> paint, tea.</p>`,
  onDone: () => mountDragSort(overlay, {
   scene: "selectSort", title: "Sort Ask vs Write",
   instructions: "Drag into Ask / Write / Not SQL.",
   successText: "SELECT sorted!",
   chips: [
    { id: "sel", text: "SELECT keyword", short: "SELECT", color: 0x22c55e },
    { id: "from", text: "FROM table", short: "FROM", color: 0x38bdf8 },
    { id: "where", text: "WHERE filter", short: "WHERE", color: 0x2dd4bf },
    { id: "order", text: "ORDER BY sort", short: "ORDER BY", color: 0xfbbf24 },
    { id: "ins", text: "INSERT new row", short: "INSERT", color: 0xf97316 },
    { id: "upd", text: "UPDATE a value", short: "UPDATE", color: 0xef4444 },
    { id: "paint", text: "Paint can", short: "Paint", color: 0xa78bfa },
    { id: "tea", text: "Cup of tea", short: "Tea", color: 0x94a3b8 }
   ],
   zones: [
    { id: "ask", label: "Ask / SELECT", accept: ["sel", "from", "where", "order"] },
    { id: "write", label: "Write / change", accept: ["ins", "upd"] },
    { id: "not", label: "Not SQL", accept: ["paint", "tea"] }
   ],
   onDone: completeSub,
  }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Sharpen the query further.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
  scene: "selectLab", title: "Sharper Query Lab", html: `<p>Reach >= 75% - WHERE finds the right row.</p>`,
  goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
  axis: "x", canvasAction: "stretch", sliderLabel: "Filter", badge: LAB_ASSET_PATHS.m2,
  onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why WHERE helps.");
 mountOrderSteps(overlay, {
  scene: "selectMeet", sceneArgs: { phase: "settle" }, title: "Why WHERE Helps",
  instructions: "Order the story.",
  items: [
   { id: "ask", html: "Ask with SELECT" },
   { id: "from", html: "Choose the table with FROM" },
   { id: "where", html: "Filter with WHERE" },
   { id: "see", html: "Read only the matching rows" }
  ],
  correctIds: ["ask", "from", "where", "see"],
  onDone: () => mountQuiz(overlay, {
   scene: "selectMeet", title: "Check",
   q: "SELECT usually...",
   opts: ["Reads data without rewriting the whole table", "Always deletes every row", "Is the same as tea", "Only paints the UI"],
   ok: 0, onDone: completeSub,
  }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the SELECT rule.");
 mountEquationBuild(overlay, {
  scene: "selectRule", title: "Name the SELECT Rule", instructions: "Tap in order.",
  tokens: [{ id: "a", html: "SELECT" }, { id: "b", html: "FROM" }, { id: "c", html: "WHERE" }, { id: "d", html: "rows" }],
  correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
  onDone: () => mountTapContinue(overlay, {
   scene: "selectRule", badge: LAB_ASSET_PATHS.rule,
   html: `<h3>Rule locked</h3><p>SELECT picks; WHERE filters the rows you see.</p>`,
   onDone: completeSub, advanceAfterDone: true,
  }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Home, school, shop, BD trips, lab.");
 mountTapContinue(overlay, {
  scene: "selectStretch", html: `<h3>Real questions</h3><p>Tap each mode - same SELECT story.</p>`,
  onDone: () => mountQuiz(overlay, {
   scene: "selectStretch", title: "Transfer",
   q: "To list Dhaka contacts you would...",
   opts: ["SELECT ... WHERE city = Dhaka", "Only drink tea", "DELETE the table first always", "Use paint instead of SQL"],
   ok: 0, onDone: completeSub,
  }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust SELECT myths.");
 mountMythCards(overlay, {
  scene: "selectMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
  myths: [
   { claim: "SELECT always changes the table", truth: "SELECT mainly reads - it does not rewrite rows", sceneMyth: 0 },
   { claim: "WHERE is just decoration", truth: "WHERE filters which rows answer the question", sceneMyth: 1 },
   { claim: "You must SELECT every column forever", truth: "Pick only the columns you need", sceneMyth: 2 },
   { claim: "Only experts can write SELECT", truth: "Kids can ask clear questions with SELECT", sceneMyth: 3 },
   { claim: "Tea is a SQL keyword", truth: "SELECT FROM WHERE are keywords - tea is a drink", sceneMyth: 4 }
  ],
  onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick SELECT fluency.");
 mountSpeedDrill(overlay, {
  scene: "selectDrill", title: "Fluency Drill", passScene: "selectMastery",
  items: [
   { q: "Does SELECT mainly read?", opts: ["Yes", "No"], ok: 0, prompt: "SELECT" },
   { q: "Does WHERE filter rows?", opts: ["Yes", "No"], ok: 0, prompt: "WHERE" },
   { q: "Is INSERT a read-only ask?", opts: ["No", "Yes"], ok: 0, prompt: "INSERT" },
   { q: "FROM picks the table?", opts: ["Yes", "No"], ok: 0, prompt: "FROM" },
   { q: "Is tea SQL?", opts: ["No", "Yes"], ok: 0, prompt: "Tea" },
   { q: "Can ORDER BY sort results?", opts: ["Yes", "Never"], ok: 0, prompt: "ORDER" }
  ],
  onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Query Kid.");
 mountOrderSteps(overlay, {
  scene: "selectMastery", title: "Query Kid Mastery", instructions: "Order your journey.",
  items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Query" }],
  correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
  onDone: () => mountTapContinue(overlay, {
   scene: "selectMastery", badge: LAB_ASSET_PATHS.m2,
   html: `<h3>Query Kid!</h3><p>You can ask tables with SELECT and WHERE.</p>`,
   onDone: completeSub, advanceAfterDone: true,
  }),
 });
}
