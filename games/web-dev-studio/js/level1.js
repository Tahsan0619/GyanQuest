/**
 * Web Dev Studio: Mission 1: HTML House
 * Script: Opening + 4 Bruner spirals (tags → nesting → structure → iframe) + recap map.
 */
import { labState, LAB_ASSET_PATHS, resetHtmlHouseState, initHtmlSub } from "./lab-state.js?v=html5";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js?v=html5";

export const L1_META = {
 objective:
 "By the end of this mission, you'll explain how HTML tags are rooms with opening and closing doors, how nesting works, what semantic tags do, and what an iframe is.",
 bdHook:
 "Every webpage you visit (school notice, family blog, BD news) is secretly a house built from tags.",
 predict: {
 q: "Before we start, what happens if you forget to close an HTML tag?",
 options: [
 "Nothing. The page still works perfectly",
 "Everything after it can leak into the wrong room and break the page",
 "The browser automatically adds the closing tag for you every time",
 ],
 ok: 1,
 },
 kidTitle: "HTML House",
 theme: "tags are rooms",
 emoji: "🏠",
 rewardName: "HTML Builder",
 intro:
 "Every webpage is secretly a house built from tags. Some rooms are wide open, some tuck inside others, and if you forget to close a door, the whole house can fall apart. Today we build one room by room.",
 everyday: ["School notice page", "Family photo blog", "Embedded map on a news site"],
 subTitles: [
 "Start Building",
 "Build One Room",
 "Tags & Elements",
 "Nest the Rooms",
 "Nesting Rule",
 "Furnish the House",
 "Semantic Rooms",
 "Cut a Window",
 "iframe Everywhere",
 "The House Is Built",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initHtmlSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetHtmlHouseState();
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Watch <html> type itself. A house frame rises from the lot.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "htmlOpen",
 badge: "Opening",
 title: "HTML House",
 pulse: true,
 ready: () => labState.htmlOpenReady || Date.now() - t0 > 2800,
 readyText: "The frame is up. Tags build houses.",
 doneLabel: "Start Building ▶",
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "html house")}
 ${n(
 "Every single webpage you've ever visited is secretly a house, built entirely out of tags. Some rooms are wide open, some are tucked inside others, and if you forget to close a door behind you, the whole house can start to fall apart. Today we're not just going to look at a webpage. We're going to build one, room by room, like a house.",
 )}`,
 onDone: completeSub,
 });
}

function s2_room({ overlay, setCoach, completeSub }) {
 setCoach("Drag opening tag, Welcome!, and closing tag. Then build again without the closing tag.");
 mountGate(overlay, {
 scene: "htmlRoom",
 badge: "Spiral 1 · Enactive",
 title: "Build One Room",
 pulse: true,
 ready: () => labState.htmlRoomBuilt && labState.htmlRoomFailed,
 readyText: "You felt both: a solid room and a leaking wall.",
 doneLabel: "Continue ▶",
 html: n(
 "A tag is a container with an opening and a closing side, like a doorway in and a doorway out. First build a complete room. Then repeat the build but leave out the closing tag entirely. Watch what leaks through the missing wall.",
 ),
 onDone: completeSub,
 });
}

function s3_tags({ overlay, setCoach, completeSub }) {
 setCoach("Blueprint ↔ code on the left canvas. Then read the formal terms.");
 mountGate(overlay, {
 scene: "htmlBlueprint",
 badge: "Spiral 1 · Iconic",
 title: "Blueprint & Code",
 ready: () => true,
 html: n(
 "A blueprint and a piece of HTML do the exact same job: marking where something begins, what goes inside it, and where it ends. Architects have done this with doorways for thousands of years. Web browsers do it with a slightly different kind of doorway.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "htmlTerms",
 badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Tag</strong>: marks start or end: <code>&lt;div&gt;</code> or <code>&lt;/div&gt;</code></p>
 <p><strong>Opening tag</strong>: no forward slash. <strong>Closing tag</strong>: has a slash.</p>
 <p><strong>Element</strong>: opening + content + closing together: <code>&lt;div&gt;Welcome!&lt;/div&gt;</code></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_nest({ overlay, setCoach, completeSub }) {
 setCoach(
 "Part 1: outer open → inner open → inner close → outer close. Part 2: same, but close OUTER before INNER.",
 );
 mountGate(overlay, {
 scene: "htmlNest",
 badge: "Spiral 2 · Enactive",
 title: "Nest the Rooms",
 pulse: true,
 ready: () => labState.htmlNestBuilt && labState.htmlNestFailed,
 readyText: "Clean nesting, then broken walls - Continue unlocked.",
 status:
 "Part 1 of 2: place tags in order (outer open → inner open → inner close → outer close).",
 liveStatus: () => {
 if (labState.prompt) return labState.prompt;
 if (labState.htmlNestBuilt) {
 return "Part 2 of 2: break the nest - outer open → inner open → OUTER close → INNER close.";
 }
 return "Part 1 of 2: outer open → inner open → inner close → outer close.";
 },
 doneLabel: "Continue ▶",
 html: n(
 "Whatever you open last, you must close first, like leaving a room inside a room. Close them out of order and the outer wall cuts straight through the inner room. That is exactly what a browser sees as broken HTML.",
 ),
 onDone: completeSub,
 });
}

function s5_nestingRule({ overlay, setCoach, completeSub }) {
 setCoach("Nesting dolls open and close in reverse order: same rule as HTML indentation.");
 mountGate(overlay, {
 scene: "htmlDolls",
 badge: "Spiral 2 · Iconic",
 title: "Rooms Inside Rooms",
 ready: () => true,
 html: n(
 "Indentation in real code is not just for looks: the deeper a tag is indented, the deeper inside the house that room actually is.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "htmlNestCode",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Nesting:</strong> placing one element completely inside another.</p>
 <p><strong>Rule:</strong> last opened, first closed.</p>
 <pre class="hh-inline-code">&lt;div&gt;\n  &lt;p&gt;Welcome!&lt;/p&gt;\n&lt;/div&gt;</pre>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_furnish({ overlay, setCoach, completeSub }) {
 setCoach("Drop header, hero, main, footer, and a blank div into the blueprint zones.");
 mountGate(overlay, {
 scene: "htmlFurnish",
 badge: "Spiral 3 · Enactive",
 title: "Furnish the House",
 pulse: true,
 ready: () => labState.htmlFurnishCount >= 5,
 readyText: "Five rooms placed: four with built-in jobs, one blank div.",
 doneLabel: "Continue ▶",
 html: n(
 "Header, hero, main, and footer came with a job already built in, just from their name. A div has no job at all. It is the blank, flexible room you use when none of the specialized rooms quite fit.",
 ),
 onDone: completeSub,
 });
}

function s7_semantic({ overlay, setCoach, completeSub }) {
 setCoach("House blueprint glows beside a real webpage skeleton: same layout.");
 mountGate(overlay, {
 scene: "htmlLayout",
 badge: "Spiral 3 · Iconic",
 title: "Every Real Website",
 ready: () => true,
 html: n(
 "This is genuinely how real websites are structured, almost every single time: header up top, a hero section to welcome you in, the main content doing the heavy lifting, and a footer holding down the bottom.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "htmlSemantic",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p>Tags like <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, and <code>&lt;footer&gt;</code> are <strong>semantic</strong>: their name tells you their job.</p>
 <p>A <code>&lt;div&gt;</code> is deliberately the opposite: meaningless on its own, ready to be whatever you need.</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_iframe({ overlay, setCoach, completeSub }) {
 setCoach("Drag iframe into the main wall, then point src at the neighbor house.");
 mountGate(overlay, {
 scene: "htmlIframe",
 badge: "Spiral 4 · Enactive",
 title: "Cut a Window",
 pulse: true,
 ready: () => labState.htmlIframeDone,
 readyText: "A window into a completely separate house.",
 doneLabel: "Continue ▶",
 html: n(
 "An iframe is not a room that belongs to this house at all. It is a window straight through to a different one entirely. That is what happens when you see an embedded map, video, or payment form on a website.",
 ),
 onDone: completeSub,
 });
}

function s9_iframeEverywhere({ overlay, setCoach, completeSub }) {
 setCoach("Maps, videos, payment boxes: all iframe windows cut into the page.");
 mountGate(overlay, {
 scene: "htmlMontage",
 badge: "Spiral 4 · Iconic",
 title: "Windows Everywhere",
 ready: () => true,
 html: n(
 "Once you know to look for it, iframe windows are everywhere online, and for good reason. It lets a page borrow trusted functionality from somewhere else without rebuilding that entire house from scratch.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "htmlSummary",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <p>Screen readers used by blind and low-vision users rely on semantic tags like <code>&lt;header&gt;</code> and <code>&lt;main&gt;</code> to describe a page out loud.</p>
 <p>A page built entirely from unlabeled <code>&lt;div&gt;</code> rooms is much harder for them to navigate.</p>
 <p><em>Next question: now that the house is built, how do we paint and furnish it?</em> (That is CSS: Mission 2.)</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch the full house replay. Then open the spiral recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "htmlClose",
 badge: "Closing",
 title: "The House Is Built",
 html: n(
 "You started today looking at an empty lot. Now you understand exactly how every real webpage gets built: tags as rooms, opened and closed like doors, nested in the right order, some with a real job built in and some left blank on purpose, and even the occasional window cut straight through into someone else's house entirely.",
 ),
 ready: () => labState.htmlCloseU >= 0.85 || Date.now() - t0 > 7000,
 readyText: "The complete house stands finished.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then Finish HTML House.");
 mountSpiralMap(overlay, {
 scene: "htmlSpiral",
 title: "Your recap map",
 finishLabel: "Finish HTML House ▶",
 narration:
 "This last screen is a recap, not a new puzzle. The four numbers are the four spirals you already finished. Tap a number to replay a short highlight. When you are ready, tap Finish HTML House.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Tags & doors" },
 { n: 2, label: "2: Nesting" },
 { n: 3, label: "3: Structure" },
 { n: 4, label: "4: iframe" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_room;
const s3 = s3_tags;
const s4 = s4_nest;
const s5 = s5_nestingRule;
const s6 = s6_furnish;
const s7 = s7_semantic;
const s8 = s8_iframe;
const s9 = s9_iframeEverywhere;
const s10 = s10_closing;
