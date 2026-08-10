/**
 * Web Dev Studio - Mission 1: HTML House (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain structure tags in your own words.",
 bdHook:
 "Bangladesh everyday: school notice page, family photo blog, BD news headline block - notice how tags build the page house.",
 predict: {
 q: "Before we start - where does a visible heading on a web page usually live?",
 options: [
 "Only in a CSS color file with no tags",
 "Inside <body>, nested inside the <html> house",
 "Outside <html> so browsers never see it",
 ],
 ok: 1,
 },

 kidTitle: "HTML House",
 theme: "structure tags",
 emoji: "\ud83c\udfe0",
 rewardName: "HTML Builder",
 intro: "A web page is a house. Tags are the rooms - <html> wraps, <head> holds meta, <body> holds what you see.",
 everyday: ["School notice page", "Family photo blog", "BD news headline block"],
 subTitles: [
 "Meet the Tag House", "Open Rooms Lab", "Sort Structure", "Build More Rooms",
 "Why Nest Tags", "Name the House Rule", "Stretch: Real Pages", "Myth Bust",
 "Fluency Drill", "HTML Builder Mastery",
 ],
};

export function runL1Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.25; labState.phase = "desk"; labState.mode = "home";
 labState.tagBuild = 0.25;
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: tags are rooms - drag <html>, <head>, <body>.");
 mountMotionChain(overlay, {
 title: "Meet the Tag House",
 beats: [
 { scene: "htmlMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m1, "html")}<p><strong>Act 1:</strong> Drag the tag chips around the house.</p>` },
 { scene: "htmlMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Links light up - <html> wraps, <head> and <body> nest inside.</p>` },
 { scene: "htmlMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> What you see on screen lives in <body> (headings, text, images).</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "htmlMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "Where does a visible heading usually live?",
 opts: ["Inside <body>", "Only in CSS files", "Only in JavaScript", "Outside <html>"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "htmlMeet", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>House unlocked</h3><p>Next: open more rooms with the dial.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Dial until more tag-rooms open (clarity >= 60%).");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "htmlLab", title: "Open Rooms Lab",
 html: `<p>Drag until the house rooms open (>= 60%).</p>`,
 goalText: "Goal >= 60%", doneLabel: "Rooms open", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Rooms", badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Shell only - few tags lit",
 melting: "Opening <head> and <body>…",
 liquid: "Inner rooms (<h1>, <p>) lighting",
 simmer: "Full tag house - structure clear",
 },
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort structure tags vs style/script vs not HTML.");
 mountTapContinue(overlay, {
 scene: "htmlSort",
 html: `<h3>Guide</h3><p><strong>Structure:</strong> &lt;h1&gt;, &lt;p&gt;, &lt;img&gt;, &lt;div&gt;.<br><strong>Style/script:</strong> color:red, onclick.<br><strong>Not:</strong> cake, sock.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "htmlSort", title: "Sort Structure",
 instructions: "Drag into Structure / Style-script / Not.",
 successText: "House sorted!",
 chips: [
 { id: "h1", text: "Heading tag", short: "<h1>", color: 0xea580c },
 { id: "p", text: "Paragraph tag", short: "<p>", color: 0xf97316 },
 { id: "img", text: "Image tag", short: "<img>", color: 0xfb923c },
 { id: "div", text: "Box tag", short: "<div>", color: 0xfdba74 },
 { id: "css", text: "A color style", short: "color:red", color: 0x38bdf8 },
 { id: "js", text: "A click script", short: "onclick", color: 0xa78bfa },
 { id: "cake", text: "Birthday cake", short: "Cake", color: 0xf472b6 },
 { id: "sock", text: "A sock", short: "Sock", color: 0x94a3b8 },
 ],
 zones: [
 { id: "struct", label: "Structure tag", accept: ["h1", "p", "img", "div"] },
 { id: "style", label: "Style / script", accept: ["css", "js"] },
 { id: "not", label: "Not HTML", accept: ["cake", "sock"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push the dial higher - fill the house.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "htmlLab", title: "Build More Rooms", html: `<p>Reach >= 75%.</p>`,
 goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Rooms", badge: LAB_ASSET_PATHS.m1,
 readoutLabels: {
 cold: "Still sparse - need more rooms",
 melting: "Nesting more tags inside <body>",
 liquid: "Almost full - <img> nearly on",
 simmer: "House filled - tidy nested tags",
 },
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order why we nest tags.");
 mountOrderSteps(overlay, {
 scene: "htmlMeet", sceneArgs: { phase: "settle" }, title: "Why Nest Tags",
 instructions: "Order the story.",
 items: [
 { id: "wrap", html: "<html> wraps the whole page" },
 { id: "head", html: "<head> holds title and links" },
 { id: "body", html: "<body> holds what people see" },
 { id: "close", html: "Close tags so rooms stay tidy" },
 ],
 correctIds: ["wrap", "head", "body", "close"],
 onDone: () => mountQuiz(overlay, {
 scene: "htmlMeet", title: "Check",
 q: "Leaving tags open and messy usually...",
 opts: ["Confuses browsers and readers", "Makes CSS faster always", "Deletes the internet", "Turns into JavaScript"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the HTML house rule.");
 mountEquationBuild(overlay, {
 scene: "htmlRule", title: "Name the House Rule", instructions: "Tap in order.",
 tokens: [
 { id: "a", html: "Tags" }, { id: "b", html: "Nest" },
 { id: "c", html: "Close" }, { id: "d", html: "House" },
 ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "htmlRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Tags nest and close - that builds the page house.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Home, school, shop, BD news, blog - same tag house.");
 mountTapContinue(overlay, {
 scene: "htmlStretch", html: `<h3>Real pages</h3><p>Tap each mode - same structure tags.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "htmlStretch", title: "Transfer",
 q: "A BD news site still needs...",
 opts: ["Structure tags like <html> and <body>", "Only paint and no tags", "Zero nesting ever", "Only JavaScript files"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust HTML myths.");
 mountMythCards(overlay, {
 scene: "htmlMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "HTML is only for experts", truth: "Kids can learn core tags with clear labs", sceneMyth: 0 },
 { claim: "Tags can stay open forever", truth: "Most tags need a matching close tag", sceneMyth: 1 },
 { claim: "Order of tags never matters", truth: "Nesting order builds the page house", sceneMyth: 2 },
 { claim: "CSS and HTML are the same", truth: "HTML = structure; CSS = look", sceneMyth: 3 },
 { claim: "One giant div is enough forever", truth: "Clear tags help people and browsers", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick HTML fluency.");
 mountSpeedDrill(overlay, {
 scene: "htmlDrill", title: "Fluency Drill", passScene: "htmlMastery",
 items: [
 { q: "Visible text lives mainly in...", opts: ["<body>", "<head> only"], ok: 0, prompt: "Body" },
 { q: "Is <h1> a structure tag?", opts: ["Yes", "No"], ok: 0, prompt: "h1" },
 { q: "color:red is mainly...", opts: ["CSS style", "An HTML room"], ok: 0, prompt: "Style" },
 { q: "Should tags nest tidy?", opts: ["Yes", "Never"], ok: 0, prompt: "Nest" },
 { q: "Cake is an HTML tag?", opts: ["No", "Yes"], ok: 0, prompt: "Cake" },
 { q: "HTML builds...", opts: ["Page structure", "Only button clicks"], ok: 0, prompt: "HTML" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - HTML Builder.");
 mountOrderSteps(overlay, {
 scene: "htmlMastery", title: "HTML Builder Mastery", instructions: "Order your journey.",
 items: [
 { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "win", html: "Build" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "win"],
 onDone: () => mountTapContinue(overlay, {
 scene: "htmlMastery", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>HTML Builder!</h3><p>Tags nest and close - your page house stands strong.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
