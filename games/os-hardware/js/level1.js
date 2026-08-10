/**
 * OS & Hardware - Mission 1: Inside the Box (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L1_META = {
 objective: "By the end of this mission, you'll be able to explain hardware does work - OS manages the team in your own words.",
 bdHook: "Bangladesh everyday: notice hardware does work - OS manages the team around you - then connect it to Inside the Box.",
 predict: {
 q: "Before we start - what do you think matters most in Inside the Box?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Inside the Box",
 theme: "hardware does work - OS manages the team",
 emoji: "\ud83e\uddf0",
 rewardName: "Box Scout",
 intro: "Hardware parts do the physical work. The operating system manages apps, memory, and devices.",
 everyday: [
 "Laptop boots",
 "Phone app switch",
 "USB stick plug-in"
 ],
 subTitles: [
 "Meet the Box",
 "Watch Team Dial",
 "Sort HW vs OS",
 "Smoother Team Lab",
 "Why OS Manages",
 "Name the Box Rule",
 "Stretch: Places",
 "Myth Bust",
 "Fluency Drill",
 "Box Scout Mastery"
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
 setCoach("Hook: parts work; OS manages the team.");
 mountMotionChain(overlay, {
 title: "Meet the Box",
 beats: [
 { scene: "boxMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000, html: `${badgeHtml(LAB_ASSET_PATHS.m1, "box")}<p><strong>Act 1:</strong> Meet CPU, memory, storage, and keyboard - the hardware team.</p>` },
 { scene: "boxMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200, html: `<p><strong>Act 2:</strong> The OS glow assigns apps, memory, and device turns.</p>` },
 { scene: "boxMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000, html: `<p><strong>Act 3:</strong> Hardware does work; OS manages who goes when.</p>` }
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "boxMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "What does the OS mainly do?",
 opts: ["Manage apps, memory, and devices", "Replace the need for any hardware", "Only draw stickers", "Delete the CPU forever"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "boxMeet", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>Box ready</h3><p>Next: dial teamwork.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Raise teamwork until the box feels smooth.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "boxLab", title: "Watch Team Dial",
 html: `<p>Drag until teamwork &gt;= 60%.</p>`,
 goalText: "Goal >= 60%", doneLabel: "Dial checked", threshold: 0.6, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Team", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort hardware, OS jobs, and tricky.");
 mountTapContinue(overlay, {
 scene: "boxSort",
 html: `<h3>Guide</h3><p><strong>Hardware:</strong> CPU, RAM, disk, keyboard.<br><strong>OS job:</strong> schedule apps, manage memory.<br><strong>Tricky:</strong> "the internet inside the chip".</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "boxSort", title: "Sort HW vs OS",
 instructions: "Drag into Hardware / OS job / Tricky.",
 successText: "Box parts sorted!",
 chips: [
 { id: "cpu", text: "CPU chip", short: "CPU", color: 9741240 },
 { id: "ram", text: "RAM memory", short: "RAM", color: 3718648 },
 { id: "disk", text: "Storage disk", short: "Disk", color: 2278750 },
 { id: "key", text: "Keyboard", short: "Keys", color: 16498468 },
 { id: "sched", text: "Schedule apps", short: "Schedule", color: 10980346 },
 { id: "mem", text: "Manage memory", short: "Manage", color: 12616956 },
 { id: "dev", text: "Talk to devices", short: "Devices", color: 8490232 },
 { id: "myth", text: "Internet inside chip", short: "Myth", color: 16347926 }
 ],
 zones: [
 { id: "hw", label: "Hardware", accept: ["cpu", "ram", "disk", "key"] },
 { id: "os", label: "OS job", accept: ["sched", "mem", "dev"] },
 { id: "tricky", label: "Tricky", accept: ["myth"] }
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Push teamwork higher.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "boxLab", title: "Smoother Team Lab", html: `<p>Reach teamwork &gt;= 75%.</p>`,
 goalText: "Goal >= 75%", doneLabel: "Lab done", threshold: 0.75, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Team", badge: LAB_ASSET_PATHS.m1,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order how the box runs a task.");
 mountOrderSteps(overlay, {
 scene: "boxMeet", sceneArgs: { phase: "settle" }, title: "Why OS Manages",
 instructions: "Order the story.",
 items: [
 { id: "power", html: "Power on hardware" },
 { id: "os", html: "OS starts and manages" },
 { id: "app", html: "Apps request resources" },
 { id: "work", html: "Hardware does the work" }
 ],
 correctIds: ["power", "os", "app", "work"],
 onDone: () => mountQuiz(overlay, {
 scene: "boxMeet", title: "Check",
 q: "Without an OS, using many apps at once is hard because...",
 opts: ["Nothing fair manages memory and device turns", "Hardware disappears", "Keyboards stop being physical", "Disks refuse to store bits"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock: hardware works, OS manages.");
 mountEquationBuild(overlay, {
 scene: "boxRule", title: "Name the Box Rule", instructions: "Tap in order.",
 tokens: [ { id: "a", html: "Hardware" }, { id: "b", html: "works" }, { id: "c", html: "/" }, { id: "d", html: "OS manages" } ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "boxRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Hardware does the work; the OS manages the team.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("Laptop, phone, tablet, BD cafe PC, lab.");
 mountTapContinue(overlay, {
 scene: "boxStretch", html: `<h3>Places</h3><p>Tap each mode - same core idea.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "boxStretch", title: "Transfer",
 q: "Switching phone apps smoothly needs...",
 opts: ["The OS managing memory and CPU turns", "Deleting the hardware", "No OS at all", "Only a sticker on the case"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust OS/hardware myths.");
 mountMythCards(overlay, {
 scene: "boxMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "The OS is a physical metal part", truth: "The OS is software that manages hardware", sceneMyth: 0 },
 { claim: "Hardware alone schedules every app fairly", truth: "The OS schedules and shares resources", sceneMyth: 1 },
 { claim: "RAM and disk are the same thing", truth: "RAM is fast working memory; disk stores longer", sceneMyth: 2 },
 { claim: "Kids cannot learn box basics", truth: "Parts vs manager is a clear kid model", sceneMyth: 3 },
 { claim: "Unplugging devices needs no OS help", truth: "The OS helps talk to devices safely", sceneMyth: 4 }
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick box fluency.");
 mountSpeedDrill(overlay, {
 scene: "boxDrill", title: "Fluency Drill", passScene: "boxMastery",
 items: [
 { q: "CPU is hardware?", opts: ["Yes", "No"], ok: 0, prompt: "CPU?" },
 { q: "OS manages apps?", opts: ["Yes", "No"], ok: 0, prompt: "OS?" },
 { q: "OS is a metal chip?", opts: ["No", "Yes"], ok: 0, prompt: "Metal?" },
 { q: "RAM = long storage?", opts: ["No", "Yes"], ok: 0, prompt: "RAM?" },
 { q: "Keyboard is hardware?", opts: ["Yes", "No"], ok: 0, prompt: "Keys?" },
 { q: "Schedule apps = OS job?", opts: ["Yes", "No"], ok: 0, prompt: "Sched?" }
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - Box Scout.");
 mountOrderSteps(overlay, {
 scene: "boxMastery", title: "Box Scout Mastery", instructions: "Order your journey.",
 items: [ { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" }, { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "box", html: "Box" } ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "box"],
 onDone: () => mountTapContinue(overlay, {
 scene: "boxMastery", badge: LAB_ASSET_PATHS.m1,
 html: `<h3>\ud83e\uddf0 Box Scout!</h3><p>You can tell hardware work from OS management.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
