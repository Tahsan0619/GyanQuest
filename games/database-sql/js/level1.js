/**
 * Database & SQL - Mission 1: Tables & Rows (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
  objective: "By the end of this mission, you'll be able to explain rows columns in your own words.",
  bdHook: "Bangladesh everyday: notice rows columns around you — then connect it to Tables & Rows.",
  predict: {
    q: "Before we start — what do you think matters most in Tables & Rows?",
    options: [
      "Guessing without checking",
      "Looking for a clear pattern or rule",
      "Skipping the practice steps",
    ],
    ok: 1,
  },

 kidTitle: "Tables & Rows",
 theme: "rows columns",
 emoji: "\u25a6",
 rewardName: "Table Scout",
 intro: "Data lives in neat rows and columns. Each row is a record; each column is a field.",
 everyday: ["Phone contacts list", "Class register", "Shop inventory sheet"],
 subTitles: [
  "Meet the Grid",
  "Fill Rows Lab",
  "Sort Table Parts",
  "Neater Grid Lab",
  "Why Rows & Columns",
  "Name the Table Rule",
  "Stretch: Real Lists",
  "Myth Bust",
  "Fluency Drill",
  "Table Scout Mastery"
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
 setCoach("Hook: watch the grid - columns across, rows down.");
 mountMotionChain(overlay, {
  title: "Meet the Grid",
  beats: [
   { scene: "tableMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
    html: `${badgeHtml(LAB_ASSET_PATHS.m1, "table")}<p><strong>Act 1:</strong> Explore the table grid with your eyes and hands.</p>` },
   { scene: "tableMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
    html: `<p><strong>Act 2:</strong> Each row is one kid record.</p>` },
   { scene: "tableMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
    html: `<p><strong>Act 3:</strong> Data lives in neat rows and columns.</p>` },
  ],
  onDone: () => mountQuiz(overlay, {
   scene: "tableMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
   q: "What is one row in a kids table?",
   opts: ["One whole record (one kid)", "Only a cake", "A sock pile", "A CSS color"],
   ok: 0, onDone: () => mountTapContinue(overlay, {
    scene: "tableMeet", badge: LAB_ASSET_PATHS.m1,
    html: `<h3>Grid unlocked</h3><p>Next: fill more neat rows with the dial.</p>`,
    onDone: completeSub, advanceAfterDone: true,
   }),
  }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until more rows appear (>= 60%).");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
  scene: "tableLab", title: "Fill Rows Lab",
  html: `<p>Drag until the grid fills neatly (>= 60%).</p>`,
  goalText: "Goal >= 60%", doneLabel: "Rows checked", threshold: 0.6, startHeat: 0.25,
  axis: "x", canvasAction: "stretch", sliderLabel: "Rows", badge: LAB_ASSET_PATHS.m1,
  onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort table parts, messy data, or not data.");
 mountTapContinue(overlay, {
  scene: "tableSort",
  html: `<h3>Guide</h3><p><strong>Table:</strong> row, column, cell, id key.<br><strong>Messy:</strong> mess pile, scrap note.<br><strong>Not:</strong> cake, sock.</p>`,
  onDone: () => mountDragSort(overlay, {
   scene: "tableSort", title: "Sort Table Parts",
   instructions: "Drag into Table / Messy / Not data.",
   successText: "Table sorted!",
   chips: [
    { id: "row", text: "A data row", short: "Row", color: 0x22c55e },
    { id: "col", text: "A column field", short: "Column", color: 0x38bdf8 },
    { id: "cell", text: "One cell value", short: "Cell", color: 0x2dd4bf },
    { id: "pk", text: "id key", short: "id key", color: 0xfbbf24 },
    { id: "pile", text: "Messy pile of notes", short: "Mess pile", color: 0xf97316 },
    { id: "scrap", text: "Scrap sticky note", short: "Scrap note", color: 0xef4444 },
    { id: "cake", text: "Birthday cake", short: "Cake", color: 0xf472b6 },
    { id: "sock", text: "A sock", short: "Sock", color: 0x94a3b8 }
   ],
   zones: [
    { id: "table", label: "Table part", accept: ["row", "col", "cell", "pk"] },
    { id: "messy", label: "Messy data", accept: ["pile", "scrap"] },
    { id: "not", label: "Not data", accept: ["cake", "sock"] }
   ],
   onDone: completeSub,
  }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push the grid neater and fuller.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
  scene: "tableLab", title: "Neater Grid Lab", html: `<p>Reach >= 75% - more rows fill in.</p>`,
  goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
  axis: "x", canvasAction: "stretch", sliderLabel: "Rows", badge: LAB_ASSET_PATHS.m1,
  onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why we use rows and columns.");
 mountOrderSteps(overlay, {
  scene: "tableMeet", sceneArgs: { phase: "settle" }, title: "Why Rows & Columns",
  instructions: "Order the story.",
  items: [
   { id: "col", html: "Columns name the fields" },
   { id: "row", html: "Each row is one record" },
   { id: "cell", html: "Cells hold values" },
   { id: "find", html: "Neat grids make finding easy" }
  ],
  correctIds: ["col", "row", "cell", "find"],
  onDone: () => mountQuiz(overlay, {
   scene: "tableMeet", title: "Check",
   q: "A messy pile of scraps is...",
   opts: ["Hard to search - not a clear table", "Better than any database", "The same as a primary key", "Required for SQL"],
   ok: 0, onDone: completeSub,
  }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the table rule.");
 mountEquationBuild(overlay, {
  scene: "tableRule", title: "Name the Table Rule", instructions: "Tap in order.",
  tokens: [{ id: "a", html: "Row" }, { id: "b", html: "Column" }, { id: "c", html: "Cell" }, { id: "d", html: "Record" }],
  correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
  onDone: () => mountTapContinue(overlay, {
   scene: "tableRule", badge: LAB_ASSET_PATHS.rule,
   html: `<h3>Rule locked</h3><p>Rows hold records; columns hold fields.</p>`,
   onDone: completeSub, advanceAfterDone: true,
  }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Contacts, register, shop, BD list, lab.");
 mountTapContinue(overlay, {
  scene: "tableStretch", html: `<h3>Real lists</h3><p>Tap each mode - same rows-and-columns idea.</p>`,
  onDone: () => mountQuiz(overlay, {
   scene: "tableStretch", title: "Transfer",
   q: "A class register is like a table because...",
   opts: ["Each student is a row with named columns", "It is made of socks", "It never has columns", "Cake stores the grades"],
   ok: 0, onDone: completeSub,
  }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust table myths.");
 mountMythCards(overlay, {
  scene: "tableMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
  myths: [
   { claim: "Tables are only for math class", truth: "Apps store people, products, and scores in tables", sceneMyth: 0 },
   { claim: "A messy pile of notes is a table", truth: "Tables need clear rows and columns", sceneMyth: 1 },
   { claim: "Columns and rows are the same", truth: "Columns are fields; rows are whole records", sceneMyth: 2 },
   { claim: "Only adults can read a table", truth: "Kids can read id, name, city grids", sceneMyth: 3 },
   { claim: "Cake is a database column", truth: "Columns are fields like name - not desserts", sceneMyth: 4 }
  ],
  onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick table fluency.");
 mountSpeedDrill(overlay, {
  scene: "tableDrill", title: "Fluency Drill", passScene: "tableMastery",
  items: [
   { q: "Is a row one record?", opts: ["Yes", "No"], ok: 0, prompt: "Row" },
   { q: "Are columns fields?", opts: ["Yes", "No"], ok: 0, prompt: "Column" },
   { q: "Is a mess pile a neat table?", opts: ["No", "Yes"], ok: 0, prompt: "Mess" },
   { q: "Can id be a key column?", opts: ["Yes", "No"], ok: 0, prompt: "id" },
   { q: "Is cake a table field?", opts: ["No", "Yes"], ok: 0, prompt: "Cake" },
   { q: "Do neat grids help finding?", opts: ["Yes", "Never"], ok: 0, prompt: "Find" }
  ],
  onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Table Scout.");
 mountOrderSteps(overlay, {
  scene: "tableMastery", title: "Table Scout Mastery", instructions: "Order your journey.",
  items: [{ id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Table" }],
  correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
  onDone: () => mountTapContinue(overlay, {
   scene: "tableMastery", badge: LAB_ASSET_PATHS.m1,
   html: `<h3>Table Scout!</h3><p>You can explain rows, columns, and records.</p>`,
   onDone: completeSub, advanceAfterDone: true,
  }),
 });
}
