/**
 * Database & SQL - Mission 1: Tables & Rows
 * 10 sub-levels, Bruner spiral: enactive -> iconic -> symbolic.
 * Target: 45-60 minutes. Accurate: rows, columns, cells, records, fields.
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain,
 mountDragSort,
 mountHeatLab,
 mountRevealSteps,
 mountEquationBuild,
 mountQuiz,
 mountSpeedDrill,
 mountOrderSteps,
 mountMythCards,
 mountTapContinue,
 mountScaleLab,
 mountMultiQuiz,
 playScene,
 badgeHtml,
} from "./lab-activities.js";

const FILL_READOUTS = {
 cold: "Empty slots - headers only",
 melting: "First student row appearing",
 liquid: "Two records - grid getting useful",
 simmer: "Full register - neat and searchable",
};

export const L1_META = {
 objective:
 "By the end of this mission, you'll be able to explain rows, columns, cells, and records in your own words.",
 bdHook:
 "Bangladesh everyday: notice class registers, phone contacts, and shop sheets - then connect them to Tables & Rows.",
 predict: {
 q: "Before we start - what mainly makes a class list easy to search?",
 options: [
 "A messy pile of sticky notes with no order",
 "Neat rows (one kid each) under named columns (fields)",
 "Writing every fact as one giant sentence",
 ],
 ok: 1,
 },

 kidTitle: "Tables & Rows",
 theme: "rows, columns, records",
 emoji: "▦",
 rewardName: "Table Scout",
 intro:
 "Phone contacts, class registers, and shop sheets are already tables. We start with a messy pile of notes, then build a neat grid you can search - and name a clear rule you can reuse anywhere.",
 everyday: [
 "Phone contacts list (name + number)",
 "Class register (one row per student)",
 "Shop inventory sheet (item, price, stock)",
 ],
 subTitles: [
 "Meet the Grid",
 "Class Register Pattern",
 "Sort: Table or Not?",
 "Fill Rows Lab",
 "Why Find Needs Structure",
 "Name the Table Rule",
 "Stretch: Real Lists",
 "Myth Bust",
 "Fluency Drill",
 "Table Scout Mastery",
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
 labState.mode = "home";
 labState.phase = "desk";
 labState.heat = 0.2;
 labState.prompt = "Table drill";

 const runners = [
 sub1_meet,
 sub2_register,
 sub3_sort,
 sub4_fill,
 sub5_why,
 sub6_rule,
 sub7_stretch,
 sub8_myths,
 sub9_drill,
 sub10_mastery,
 ];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 fn(api);
 });
 fn(api);
}

function sub1_meet({ overlay, setCoach, completeSub }) {
 setCoach(
 "Hook + light enactive: open a blank sheet, name columns across, then watch each row become one kid record.",
 );
 mountMotionChain(overlay, {
 title: "Meet the Grid",
 beats: [
 {
 scene: "tableMeet",
 sceneArgs: { phase: "desk" },
 dwellMs: 4200,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "table")}
 <p><strong>Act 1 - Everyday sheet:</strong> Tap the register on the canvas (or watch) as a blank grid appears on the desk.</p>
 <p>A table starts as paper with empty boxes - not magic.</p>`,
 },
 {
 scene: "tableMeet",
 sceneArgs: { phase: "columns" },
 dwellMs: 4500,
 html: `<p><strong>Act 2 - Columns across:</strong> Headers light up: <code>id</code>, <code>name</code>, <code>city</code>.</p>
 <p>Each column is one <strong>field</strong> - the same question asked for every person.</p>`,
 },
 {
 scene: "tableMeet",
 sceneArgs: { phase: "rows" },
 dwellMs: 4200,
 html: `<p><strong>Act 3 - Rows down:</strong> Rafi, Maya, and Nila each get one horizontal line.</p>
 <p>One row = one whole <strong>record</strong> (one kid), not one random word.</p>`,
 },
 {
 scene: "tableMeet",
 sceneArgs: { phase: "predict" },
 dwellMs: 4000,
 html: `<p><strong>Act 4 - Predict:</strong> If you want one whole kid’s story, do you read <strong>across a row</strong> or <strong>down a column</strong>?</p>
 <p>Watch the highlighted line before we lock the big idea.</p>`,
 },
 {
 scene: "tableMeet",
 sceneArgs: { phase: "settle" },
 dwellMs: 4000,
 html: `<p><strong>Act 5 - Big idea:</strong> Contacts, registers, and shop sheets share one claim.</p>
 <p>Useful data lives in neat <strong>rows and columns</strong> you can scan and search.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "tableMeet",
 sceneArgs: { phase: "settle" },
 title: "Exit check",
 q: "What did the grid model suggest about everyday lists?",
 opts: [
 "Useful data lives in neat rows (records) and columns (fields)",
 "A table is only a cake recipe",
 "Rows and columns are the same thing",
 "You can never search a table",
 ],
 ok: 0,
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "tableMeet",
 sceneArgs: { phase: "settle" },
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>You met Tables & Rows</h3><p>Next we turn a messy pile of student notes into a class register - ordered fields, not scrap paper.</p>`,
 onDone: completeSub,
 advanceAfterDone: true,
 });
 },
 });
 },
 });
}

function sub2_register({ overlay, setCoach, completeSub }) {
 setCoach(
 "Iconic view: a class register is an ordered table (id, name, city) - not a sticky-note pile.",
 );
 mountMotionChain(overlay, {
 title: "Class Register Pattern",
 beats: [
 {
 scene: "tablePattern",
 sceneArgs: { assemble: false },
 dwellMs: 3800,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "register")}
 <p><strong>Act 1:</strong> Sticky notes and scrap names on the desk. Finding “Maya’s city” is slow.</p>`,
 },
 {
 scene: "tablePattern",
 sceneArgs: { assemble: "messy" },
 dwellMs: 4200,
 html: `<p><strong>Act 2 - Mess comparison:</strong> Tap or drag the scrap pile.</p>
 <p>Messy notes also hold facts, but they are <strong>not arranged in clear rows and columns</strong>.</p>`,
 },
 {
 scene: "tablePattern",
 sceneArgs: { assemble: true },
 dwellMs: 5200,
 html: `<p><strong>Act 3 - Register assemble:</strong> Headers lock in; Rafi / Maya / Nila fill as rows.</p>
 <p>Real class lists have many more students; we show a tiny model you can read at a glance.</p>`,
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "tablePattern",
 sceneArgs: { assemble: true },
 title: "Quick check",
 q: "What did the growing register show about student lists?",
 opts: [
 "A neat pattern of many records stuck in rows under named columns",
 "One giant cell with every name smashed together",
 "Only desserts can be stored",
 "Tables only exist as pure energy",
 ],
 ok: 0,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "tablePattern",
 sceneArgs: { assemble: true },
 title: "Field check",
 q: "In this intro model, id / name / city are best described as...",
 opts: [
 "Columns (fields) - the same questions for every student row",
 "Random decorations on the page",
 "One sticky note glued over the whole sheet",
 "Thoughts, not data",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub3_sort({ overlay, setCoach, completeSub }) {
 setCoach(
 "Enactive sort: table parts have place and meaning. Cake and socks are not database fields.",
 );
 labState.reveal = false;
 mountTapContinue(overlay, {
 scene: "tableSort",
 html: `<h3>Table vs messy vs not-data</h3>
 <p><strong>Table part:</strong> row, column, cell, id key - pieces of a neat grid.</p>
 <p><strong>Messy data:</strong> facts exist, but without clear rows/columns they are hard to search.</p>
 <p><strong>Not data (here):</strong> birthday cake and a sock are everyday objects, not fields in the register.</p>
 <p>Next: sort eight cases on the canvas or with chips.</p>`,
 onDone: () => {
 mountDragSort(overlay, {
 scene: "tableSort",
 title: "Sort: Table or not?",
 instructions: "Drag into Table part / Messy data / Not data.",
 successText: "Table sorted!",
 chips: [
 { id: "row", text: "A data row (one student)", short: "Row", color: 0x22c55e },
 { id: "col", text: "A column field (city)", short: "Column", color: 0x38bdf8 },
 { id: "cell", text: "One cell value (Dhaka)", short: "Cell", color: 0x2dd4bf },
 { id: "pk", text: "id key column", short: "id key", color: 0xfbbf24 },
 { id: "pile", text: "Messy pile of notes", short: "Mess pile", color: 0xf97316 },
 { id: "scrap", text: "Scrap sticky note", short: "Scrap note", color: 0xef4444 },
 { id: "cake", text: "Birthday cake", short: "Cake", color: 0xf472b6 },
 { id: "sock", text: "A sock", short: "Sock", color: 0x94a3b8 },
 ],
 zones: [
 {
 id: "table",
 label: "Table part",
 accept: ["row", "col", "cell", "pk"],
 },
 {
 id: "messy",
 label: "Messy data",
 accept: ["pile", "scrap"],
 },
 {
 id: "not",
 label: "Not data",
 accept: ["cake", "sock"],
 },
 ],
 onDone: () => {
 mountQuiz(overlay, {
 scene: "tableSort",
 title: "Justify",
 q: "Why is a messy pile of sticky notes NOT a clear table?",
 opts: [
 "Facts may exist, but without named columns and neat rows it is hard to search",
 "Because sticky notes are invisible",
 "Because piles are made of steam",
 "Because sticky notes are a type of primary key",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub4_fill({ overlay, setCoach, completeSub }) {
 setCoach(
 "Enactive: fill empty row slots until the register is readable. Drag the fill handle on the canvas too.",
 );
 labState.heat = 0.15;
 mountHeatLab(overlay, {
 scene: "tableLab",
 badge: LAB_ASSET_PATHS.m1,
 title: "Fill Rows Lab",
 html: `<p>An empty grid is only headers. Drag the dial (or canvas handle) until <strong>student rows fill in</strong> - same columns, more records.</p>
 <p>Use the slider, +/−, or drag the teal handle on the canvas.</p>`,
 goalText: "Goal: fill past ~75% so three kid rows are clearly visible.",
 startHeat: 0.15,
 threshold: 0.75,
 doneLabel: "Rows filled - continue ▶",
 axis: "x",
 canvasAction: "stretch",
 sliderLabel: "Row fill",
 readoutLabels: FILL_READOUTS,
 onDone: () => {
 mountQuiz(overlay, {
 scene: "tableLab",
 title: "Structure check",
 q: "When you fill more rows, what stays the same?",
 opts: [
 "The columns (fields) stay the same; you add more records under them",
 "The table disappears into nothing",
 "Every new row invents brand-new column names",
 "Rows erase the headers forever",
 ],
 ok: 0,
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "tableLab",
 title: "Empty -> filled story",
 steps: [
 "Start: headers name the fields (id, name, city).",
 "Add a row: one student becomes one horizontal record.",
 "Add more rows: more kids, same questions down each column.",
 "Lesson: filling rows adds records - it does not scramble the field names.",
 ],
 onStep: (i) => {
 const heat = 0.2 + i * 0.2;
 labState.heat = heat;
 labState.heatTarget = heat;
 },
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub5_why({ overlay, setCoach, completeSub }) {
 setCoach(
 "Explain: neat columns + rows make finding Maya’s city easy. Focus on the register and the find glow.",
 );
 mountOrderSteps(overlay, {
 scene: "tableMeet",
 sceneArgs: { phase: "settle" },
 title: "Why Find Needs Structure",
 instructions: "Order the find story.",
 items: [
 { id: "col", html: "Columns name the fields (what we ask)" },
 { id: "row", html: "Each row is one record (who we ask about)" },
 { id: "cell", html: "Cells hold the answers (values)" },
 { id: "find", html: "Neat grids make finding a city or name easy" },
 ],
 correctIds: ["col", "row", "cell", "find"],
 onDone: () => {
 mountRevealSteps(overlay, {
 scene: "tableFind",
 title: "Causal chain",
 steps: [
 "Headers tell you which column means “city”.",
 "You scan down the name column until you hit Maya.",
 "You read across that row into the city cell - Ctg.",
 "Without columns, you would dig through a scrap pile every time.",
 ],
 onStep: (i) => {
 labState.phase = ["headers", "scan", "cell", "compare"][i] || "cell";
 labState.heat = 0.4 + i * 0.15;
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "tableFind",
 title: "Same idea?",
 q: "A class register and a phone contacts list both help because...",
 opts: [
 "They store facts in rows and columns you can scan",
 "They are three unrelated desserts",
 "Tables vanish when you close the book",
 "Only scrap piles have structure",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub6_rule({ overlay, setCoach, completeSub }) {
 setCoach(
 "Symbolic: build the table rule. Scale scrubber is sheet → columns → rows → cell/record - separate from later SQL SELECT.",
 );
 mountEquationBuild(overlay, {
 scene: "tableRule",
 title: "Name the Table Rule",
 instructions: "Tap tokens in order to build the Tables & Rows rule.",
 badge: LAB_ASSET_PATHS.rule,
 tokens: [
 { id: "a", html: "Useful data" },
 { id: "b", html: "lives in neat rows" },
 { id: "c", html: "(one record each)" },
 { id: "d", html: "and named columns (fields)" },
 ],
 correctIds: ["a", "b", "c", "d"],
 onDone: () => {
 mountScaleLab(overlay, {
 scene: "tableRule",
 title: "Structure scrubber",
 html: `<p>Slide from everyday sheet → named columns → filled rows → one cell/record highlight.</p>
 <p>The Tables & Rows rule is about <strong>records in rows under named fields</strong> - not yet writing SQL.</p>`,
 start: 0,
 threshold: 0.85,
 sliderLabel: "Table scale: sheet → columns → rows → cell",
 goalText: "Left canvas follows the same order: blank sheet → headers → rows → cell/record.",
 readoutLabels: {
 low: "Everyday blank sheet",
 mid: "Named columns (fields)",
 high: "Rows + one cell/record highlighted",
 },
 onDone: () => {
 mountQuiz(overlay, {
 scene: "tableRule",
 title: "Model check",
 q: "What is the main Tables & Rows rule?",
 opts: [
 "Useful data lives in neat rows (records) under named columns (fields)",
 "Tables are only for math class",
 "Columns and rows are identical words with no difference",
 "Only adults can read a grid",
 ],
 ok: 0,
 onDone: completeSub,
 });
 },
 });
 },
 });
}

function sub7_stretch({ overlay, setCoach, completeSub }) {
 setCoach(
 "Transfer: same rows-and-columns idea in contacts, register, shop, rickshaw fares, and SQL tables.",
 );
 const modes = [
 {
 mode: "home",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "contacts")}<p><strong>Phone contacts:</strong> Each person is a row; name and number are columns - same structure as a register.</p>`,
 },
 {
 mode: "school",
 html: `<p><strong>Class register:</strong> One student per row - attendance and city sit in named fields you can scan.</p>`,
 },
 {
 mode: "shop",
 html: `<p><strong>Shop inventory:</strong> Item, price, and stock are columns; each product is a row on the sheet.</p>`,
 },
 {
 mode: "bd",
 html: `<p><strong>Rickshaw fare list:</strong> From → to → fare can be a tiny table on paper or in an app.</p>`,
 },
 {
 mode: "lab",
 html: `<p><strong>SQL table:</strong> Same idea with stricter headers - rows = records, columns = fields (ready for SELECT later).</p>`,
 },
 ];
 let step = 0;

 function show() {
 if (step >= modes.length) {
 mountQuiz(overlay, {
 scene: "tableStretch",
 sceneArgs: { mode: "school" },
 title: "Stretch check",
 q: "Which statement fits contacts, registers, shops, fare lists, and SQL tables?",
 opts: [
 "They all store facts in neat rows and columns you can scan",
 "Only school registers have structure",
 "Shop sheets are empty of fields",
 "Rows only exist inside math class",
 ],
 ok: 0,
 onDone: completeSub,
 });
 return;
 }
 const m = modes[step];
 labState.mode = m.mode;
 mountTapContinue(overlay, {
 scene: "tableStretch",
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

function sub8_myths({ overlay, setCoach, completeSub }) {
 setCoach("Misconceptions: claim first on canvas; truth appears only after you bust the myth.");
 mountMythCards(overlay, {
 scene: "tableMyth",
 title: "Myth Bust",
 badge: LAB_ASSET_PATHS.myth,
 myths: [
 {
 sceneMyth: 0,
 title: "“Tables are only for math class”",
 claim: "Tables are only for math class.",
 truth: "Apps store people, products, and scores in tables every day.",
 },
 {
 sceneMyth: 1,
 title: "“A messy pile is a table”",
 claim: "A messy pile of notes is already a table.",
 truth: "Tables need clear rows and named columns you can scan.",
 },
 {
 sceneMyth: 2,
 title: "“Columns and rows are the same”",
 claim: "Columns and rows mean the same thing.",
 truth: "Columns are fields; rows are whole records.",
 },
 {
 sceneMyth: 3,
 title: "“Only adults can read tables”",
 claim: "Only adults can read a table.",
 truth: "Kids can read id, name, city grids - start small and grow.",
 },
 {
 sceneMyth: 4,
 title: "“Cake is a database column”",
 claim: "Cake is a database column.",
 truth: "Columns are fields like name or city - not desserts.",
 },
 ],
 onDone: completeSub,
 });
}

function sub9_drill({ overlay, setCoach, completeSub }) {
 setCoach("Fluency: quick application checks. Need about 80% to unlock Continue.");
 mountSpeedDrill(overlay, {
 scene: "tableDrill",
 passScene: "tableMastery",
 passRatio: 0.8,
 title: "Fluency Drill",
 items: [
 {
 prompt: "One row",
 q: "A row in a kids table is...",
 opts: ["One whole record (one kid)", "Only a column header", "A sock pile", "A random scribble"],
 ok: 0,
 },
 {
 prompt: "Columns",
 q: "Columns are best described as...",
 opts: ["Named fields (same question per row)", "Random cake frosting", "Invisible steam", "Thoughts only"],
 ok: 0,
 },
 {
 prompt: "Mess pile",
 q: "Is a messy sticky-note pile a neat table?",
 opts: ["No - it lacks clear rows and columns", "Yes - any pile counts"],
 ok: 0,
 },
 {
 prompt: "id key",
 q: "Can id be a useful key column?",
 opts: ["Yes - it helps tell rows apart", "No - keys are only desserts"],
 ok: 0,
 },
 {
 prompt: "Cell value",
 q: "A cell holds...",
 opts: ["One value at a row-column crossing", "The entire database forever", "Only light beams", "Nothing useful"],
 ok: 0,
 },
 {
 prompt: "Register",
 q: "A class register is like a table because...",
 opts: [
 "Each student is a row with named columns",
 "It never has columns",
 "It is made of socks",
 "Cake stores the grades",
 ],
 ok: 0,
 },
 {
 prompt: "Table rule",
 q: "Best Tables & Rows rule?",
 opts: [
 "Useful data lives in neat rows under named columns",
 "Only metals have columns",
 "Rows are visible glitter only",
 "Rows hate having fields",
 ],
 ok: 0,
 },
 {
 prompt: "Find city",
 q: "To find Maya’s city you usually...",
 opts: [
 "Scan the name column, then read across that row",
 "Throw the sheet away",
 "Rename every column to cake",
 "Ignore headers forever",
 ],
 ok: 0,
 },
 ],
 onDone: completeSub,
 });
}

function sub10_mastery({ overlay, setCoach, completeSub }) {
 setCoach("Mastery: rebuild the path, transfer to contacts + shop sheet, then prove it.");
 playScene("tableMastery");
 mountOrderSteps(overlay, {
 scene: "tableMastery",
 title: "Table Scout Mastery - learning path",
 instructions: "Tap Bruner order: meet → register → sort/fill → rule → stretch/myths.",
 items: [
 { id: "1", html: "Meet the grid (concrete)" },
 { id: "2", html: "Assemble a class register" },
 { id: "3", html: "Sort parts / fill rows (do it)" },
 { id: "4", html: "Name the rows-and-columns rule" },
 { id: "5", html: "Stretch + bust myths" },
 ],
 correctIds: ["1", "2", "3", "4", "5"],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "tableMastery",
 html: `<h3>Mixed case</h3>
 <p><strong>Contacts + shop sheet:</strong> Phone names/numbers and shop item/price/stock are different topics - same structure: one record per row, named fields across.</p>
 <p>Ready for the final checks?</p>`,
 onDone: () => {
 mountMultiQuiz(overlay, {
 scene: "tableMastery",
 title: "Final mastery",
 doneTitle: "Table Scout ready",
 items: [
 {
 q: "Registers, contacts, and inventory sheets all teach the same idea because...",
 opts: [
 "They store facts as records in rows under named columns",
 "They are unrelated magic tricks",
 "Only contacts have fields",
 "Rows only appear when we bake cake",
 ],
 ok: 0,
 },
 {
 q: "A correct statement about rows vs columns here is...",
 opts: [
 "A row is one record; a column is one field shared across records",
 "Rows and columns are identical words with no difference",
 "Columns are just decorations",
 "Rows only exist inside myths",
 ],
 ok: 0,
 },
 {
 q: "Which belongs in “not a table field” here?",
 opts: ["A birthday cake on the desk", "The city column", "An id key", "A student name cell"],
 ok: 0,
 },
 ],
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "tableMastery",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Mission 1 complete path</h3>
 <p>You earned the story arc from a blank sheet to a reusable table rule. Use step dots to replay any weak spot. Press <strong>Next</strong> in the dock to claim <strong>Table Scout</strong>.</p>`,
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
