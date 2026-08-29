/**
 * Database & SQL - Mission 1: Tables & Rows
 * Script: Opening + 4 Bruner spirals (database → table/row → schema → SQL) + recap.
 */
import { labState, LAB_ASSET_PATHS, resetTablesRowsState, initDbSub } from "./lab-state.js?v=stor2";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=stor4";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain databases, tables, rows, columns, schema rules, and basic SELECT queries in your own words.",
 bdHook:
 "Class registers, phone contacts, shop sheets - organized shelves beat scattered piles every time.",
 predict: {
 q: "Server Basics asked: where does the kitchen keep its ingredients? What's the answer?",
 options: [
 "In a database - organized storage for information",
 "Painted on the wall with CSS only",
 "Inside the browser's HTML tags",
 ],
 ok: 0,
 },
 kidTitle: "Tables & Rows",
 theme: "storage & structure",
 emoji: "▦",
 rewardName: "Table Scout",
 intro:
 "Behind the kitchen door is the storage room - where every customer, order, and ingredient actually lives. Today we open it and learn how organized data works.",
 everyday: ["Phone contacts list", "Class register", "Shop inventory sheet"],
 subTitles: [
 "Open the Storage Room",
 "Find J. Rivera",
 "What Is a Database?",
 "Build the Shelf",
 "Table & Row",
 "Break the Rules",
 "The Blueprint",
 "Fill the Request",
 "Real SQL",
 "Storage Room Understood",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initDbSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetTablesRowsState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Open the storage room door on the canvas, then continue.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "tblOpen",
 badge: "Opening",
 title: "Tables & Rows",
 pulse: true,
 ready: () => labState.dbOpenReady || Date.now() - t0 > 5000,
 readyText: "Every customer and ingredient lives back here.",
 doneLabel: "Open the Storage Room ▶",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "database")}
 ${n(
 "Every order this kitchen has ever completed needed ingredients from somewhere - and 'somewhere' has always been this door. Today we finally open it and see how everything is organized.",
 )}`,
 onDone: completeSub,
 });
}

function s2_search({ overlay, setCoach, completeSub }) {
 setCoach("Chaotic pile: dig for J. Rivera. Then try the organized R folder.");
 mountGate(overlay, {
 scene: "tblSearch",
 badge: "Spiral 1 · Enactive",
 title: "Find One Customer",
 pulse: true,
 ready: () => labState.dbFoundRivera && labState.dbOrganizedFound,
 readyText: "Same information - organized instead of scattered. Instant.",
 doneLabel: "Continue ▶",
 html: n(
 "Find J. Rivera in the chaotic pile (click through slips). Then switch to organized shelves and find them in one click on the R folder.",
 ),
 onDone: completeSub,
 });
}

function s3_database({ overlay, setCoach, completeSub }) {
 setCoach("One room, many shelves - each holding one kind of thing.");
 mountGate(overlay, {
 scene: "tblShelves1",
 badge: "Spiral 1 · Iconic",
 title: "The Storage Room",
 ready: () => true,
 html: n(
 "Customers stay with customers, orders with orders - nothing mixed on the same shelf.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "tblTerms1",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Database</strong> - organized, searchable stored information.</p>
 <p>A pile isn't a database. Structure is the entire point.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_build({ overlay, setCoach, completeSub }) {
 setCoach("Drag Name, Email, City headers - then place 3 customer cards.");
 mountGate(overlay, {
 scene: "tblBuild2",
 badge: "Spiral 2 · Enactive",
 title: "Build the Customers Shelf",
 pulse: true,
 ready: () => (labState.dbHeaders || []).length >= 3 && (labState.dbRows || []).length >= 3,
 readyText: "One shelf, one template, many individual cards.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag three header labels into the template, then fill and place three cards - same three fields on every card, different information each time.",
 ),
 onDone: completeSub,
 });
}

function s5_table({ overlay, setCoach, completeSub }) {
 setCoach("Shelf becomes spreadsheet - same data, grid view.");
 mountGate(overlay, {
 scene: "tblGrid2",
 badge: "Spiral 2 · Iconic",
 title: "Shelf ↔ Table",
 ready: () => true,
 html: n(
 "What looked like labeled cards on a shelf is precisely the same thing as a table with rows and columns.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "tblTerms2",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Table</strong> · <strong>Row (record)</strong> · <strong>Column (field)</strong></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_schema({ overlay, setCoach, completeSub }) {
 setCoach("Try blank name + letters in phone - then fix and submit.");
 mountGate(overlay, {
 scene: "tblSchema3",
 badge: "Spiral 3 · Enactive",
 title: "Try to Break the Rules",
 pulse: true,
 ready: () => labState.dbRejected && labState.dbAcceptedRow,
 readyText: "Blueprint enforced - bad card rejected, good card accepted.",
 doneLabel: "Continue ▶",
 html: n(
 "Leave Name empty and type abc-defg in Phone - watch it bounce back. Then fill a real name and digits-only phone.",
 ),
 onDone: completeSub,
 });
}

function s7_blueprint({ overlay, setCoach, completeSub }) {
 setCoach("Each column has a type and required/optional rule.");
 mountGate(overlay, {
 scene: "tblBlueprint3",
 badge: "Spiral 3 · Iconic",
 title: "The Blueprint",
 ready: () => true,
 html: n(
 "Any card that doesn't match the job description doesn't get filed - which keeps a large database from turning back into a chaotic pile.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "tblTerms3",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>Schema</strong> · <strong>Data type</strong> · Blueprint before data.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_query({ overlay, setCoach, completeSub }) {
 setCoach('Drag "Show me", "from", "where" pieces - get Austin customers.');
 mountGate(overlay, {
 scene: "tblQuery4",
 badge: "Spiral 4 · Enactive",
 title: "Fill Out a Request Form",
 pulse: true,
 ready: () => {
 const p = labState.dbQueryParts || {};
 return p.select && p.from && p.where;
 },
 readyText: "Precise question - exactly the matching cards.",
 doneLabel: "Continue ▶",
 html: n(
 "Drag Name+Email into Show me, Customers into from, City = Austin into where - watch matching cards slide forward.",
 ),
 onDone: completeSub,
 });
}

function s9_sql({ overlay, setCoach, completeSub }) {
 setCoach("Request form = real SQL - SELECT, FROM, WHERE.");
 mountGate(overlay, {
 scene: "tblMorph4",
 badge: "Spiral 4 · Iconic",
 title: "Form Becomes SQL",
 ready: () => true,
 html: n(
 "The request form is genuinely, almost word for word, the structure of real SQL - plain English first.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "tblTerms4",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <pre class="hh-inline-code">SELECT Name, Email
FROM Customers
WHERE City = 'Austin';</pre>
 <p><em>Next: linking Customers to Orders - relationships between tables.</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the storage room fully lit. Then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "tblClose",
 badge: "Closing",
 title: "The Storage Room, Understood",
 html: n(
 "Organized shelves instead of scattered piles, blueprints guaranteeing every card follows the rules, and a precise way to ask for exactly the information you need. This is how data behind almost every app is actually stored.",
 ),
 ready: () => labState.dbCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "Shelves · Blueprints · Query terminal.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then Finish Tables & Rows.");
 mountSpiralMap(overlay, {
 scene: "tblSpiral",
 title: "Your recap map",
 finishLabel: "Finish Tables & Rows ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Database" },
 { n: 2, label: "2: Table/Row" },
 { n: 3, label: "3: Schema" },
 { n: 4, label: "4: SQL" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_search;
const s3 = s3_database;
const s4 = s4_build;
const s5 = s5_table;
const s6 = s6_schema;
const s7 = s7_blueprint;
const s8 = s8_query;
const s9 = s9_sql;
const s10 = s10_closing;
