/**
 * ICT - Mission 3: Files & Folders (deepened)
 */
import { labState, LAB_ASSET_PATHS } from "./lab-state.js";
import {
 mountMotionChain, mountDragSort, mountHeatLab, mountEquationBuild,
 mountQuiz, mountSpeedDrill, mountMythCards, mountTapContinue, mountOrderSteps, badgeHtml,
} from "./lab-activities.js";

export const L3_META = {
 objective: "By the end of this mission, you'll be able to explain name / save / find in your own words.",
 bdHook: "Bangladesh everyday: notice name / save / find around you - then connect it to Files & Folders.",
 predict: {
 q: "Before we start - what do you think matters most in Files & Folders?",
 options: [
 "Guessing without checking",
 "Looking for a clear pattern or rule",
 "Skipping the practice steps",
 ],
 ok: 1,
 },

 kidTitle: "Files & Folders",
 theme: "name / save / find",
 emoji: "\ud83d\udcc1",
 rewardName: "File Finder",
 intro: "Clear names and folders make homework findable - on PC, phone, or cloud.",
 everyday: ["School folder", "Photo albums", "USB stick"],
 subTitles: [
 "Meet Files & Folders", "Save Bar Lab", "Sort into Folders", "Save Again Lab",
 "Find Path Story", "Name the File Rule", "Stretch: Places", "Myth Bust",
 "Fluency Drill", "File Finder Mastery",
 ],
};

export function runL3Sub(subIndex, api) {
 const { registerTryAgain } = api;
 labState.reveal = false; labState.tokenProgress = 0; labState.masteryStep = 0;
 labState.placed = {}; labState.selectedId = null; labState.mythPhase = "claim";
 labState.heat = 0.25; labState.phase = "desk"; labState.mode = "usb";
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => { api.overlay.innerHTML = ""; fn(api); });
 fn(api);
}

function s1({ overlay, setCoach, completeSub }) {
 setCoach("Hook: folders are labeled boxes for files.");
 mountMotionChain(overlay, {
 title: "Meet Files & Folders",
 beats: [
 { scene: "filesMeet", sceneArgs: { phase: "desk" }, dwellMs: 4000,
 html: `${badgeHtml(LAB_ASSET_PATHS.m3, "files")}<p><strong>Act 1:</strong> Drag School/Photos folders and files.</p>` },
 { scene: "filesMeet", sceneArgs: { phase: "glow" }, dwellMs: 4200,
 html: `<p><strong>Act 2:</strong> Open School - homework belongs here.</p>` },
 { scene: "filesMeet", sceneArgs: { phase: "settle" }, dwellMs: 4000,
 html: `<p><strong>Act 3:</strong> Good names + folders = easy find.</p>` },
 ],
 onDone: () => mountQuiz(overlay, {
 scene: "filesMeet", sceneArgs: { phase: "settle" }, title: "Exit check",
 q: "Best place for math-hw.txt?",
 opts: ["School folder", "Random Desktop pile forever", "Rename to asdfgh", "Delete always"],
 ok: 0, onDone: () => mountTapContinue(overlay, {
 scene: "filesMeet", badge: LAB_ASSET_PATHS.m3,
 html: `<h3>Folders ready</h3><p>Next: practice saving.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 }),
 });
}

function s2({ overlay, setCoach, completeSub }) {
 setCoach("Fill the save bar into School/hw.txt.");
 labState.heat = 0.25;
 mountHeatLab(overlay, {
 scene: "filesLab", title: "Save Bar Lab",
 html: `<p>Drag until save >= 65%.</p>`,
 goalText: "Goal >= 65%", doneLabel: "Saved", threshold: 0.65, startHeat: 0.25,
 axis: "x", canvasAction: "stretch", sliderLabel: "Save", badge: LAB_ASSET_PATHS.m3,
 onDone: completeSub,
 });
}

function s3({ overlay, setCoach, completeSub }) {
 setCoach("Sort files into School, Media, or Rename.");
 mountTapContinue(overlay, {
 scene: "filesSort",
 html: `<h3>Guide</h3><p><strong>School:</strong> hw, essay, notes.<br><strong>Media:</strong> pics, song, gif.<br><strong>Rename:</strong> asdfgh.</p>`,
 onDone: () => mountDragSort(overlay, {
 scene: "filesSort", title: "Sort into folders", instructions: "Drag chips to folders.",
 successText: "Organized!",
 chips: [
 { id: "hw", text: "math-hw.txt", short: "math-hw", color: 0x60a5fa },
 { id: "pic", text: "eid.jpg", short: "eid.jpg", color: 0x22c55e },
 { id: "song", text: "song.mp3", short: "song", color: 0xa78bfa },
 { id: "essay", text: "essay.docx", short: "essay", color: 0x38bdf8 },
 { id: "selfie", text: "selfie.png", short: "selfie", color: 0x4ade80 },
 { id: "junk", text: "asdfgh", short: "asdfgh", color: 0xf87171 },
 { id: "notes", text: "class-notes", short: "notes", color: 0x93c5fd },
 { id: "meme", text: "funny.gif", short: "funny", color: 0xfbbf24 },
 ],
 zones: [
 { id: "school", label: "School folder", accept: ["hw", "essay", "notes"] },
 { id: "media", label: "Photos/Music", accept: ["pic", "song", "selfie", "meme"] },
 { id: "rename", label: "Needs better name", accept: ["junk"] },
 ],
 onDone: completeSub,
 }),
 });
}

function s4({ overlay, setCoach, completeSub }) {
 setCoach("Save again to a higher goal.");
 labState.heat = 0.4;
 mountHeatLab(overlay, {
 scene: "filesLab", title: "Save Again Lab", html: `<p>Reach >= 80%.</p>`,
 goalText: "Goal >= 80%", doneLabel: "Lab done", threshold: 0.8, startHeat: 0.4,
 axis: "x", canvasAction: "stretch", sliderLabel: "Save", badge: LAB_ASSET_PATHS.m3,
 onDone: completeSub,
 });
}

function s5({ overlay, setCoach, completeSub }) {
 setCoach("Order how we find a file later.");
 mountOrderSteps(overlay, {
 scene: "filesMeet", sceneArgs: { phase: "settle" }, title: "Find path story",
 instructions: "Order the find path.",
 items: [
 { id: "name", html: "Give a clear name" },
 { id: "folder", html: "Put in a folder" },
 { id: "save", html: "Save / confirm" },
 { id: "find", html: "Open folder to find later" },
 ],
 correctIds: ["name", "folder", "save", "find"],
 onDone: completeSub,
 });
}

function s6({ overlay, setCoach, completeSub }) {
 setCoach("Lock the file rule.");
 mountEquationBuild(overlay, {
 scene: "filesRule", title: "Name the File Rule", instructions: "Tap in order.",
 tokens: [
 { id: "a", html: "Name" }, { id: "b", html: "Folder" },
 { id: "c", html: "Save" }, { id: "d", html: "Find" },
 ],
 correctIds: ["a", "b", "c", "d"], badge: LAB_ASSET_PATHS.rule,
 onDone: () => mountTapContinue(overlay, {
 scene: "filesRule", badge: LAB_ASSET_PATHS.rule,
 html: `<h3>Rule locked</h3><p>Name / Folder / Save / Find.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}

function s7({ overlay, setCoach, completeSub }) {
 setCoach("USB, cloud, phone, lab, home.");
 mountTapContinue(overlay, {
 scene: "filesStretch", html: `<h3>Places</h3><p>Same organize idea everywhere.</p>`,
 onDone: () => mountQuiz(overlay, {
 scene: "filesStretch", title: "Transfer",
 q: "Cloud storage still needs...",
 opts: ["Folders and clear names", "Zero organization forever", "Only asdfgh names", "No saving"],
 ok: 0, onDone: completeSub,
 }),
 });
}

function s8({ overlay, setCoach, completeSub }) {
 setCoach("Bust file myths.");
 mountMythCards(overlay, {
 scene: "filesMyth", title: "Myth Bust", badge: LAB_ASSET_PATHS.myth,
 myths: [
 { claim: "File names don't matter", truth: "Clear names help you find work", sceneMyth: 0 },
 { claim: "Everything can sit on Desktop", truth: "Folders keep things searchable", sceneMyth: 1 },
 { claim: "Closing without save keeps edits", truth: "Unsaved work can disappear", sceneMyth: 2 },
 { claim: "asdfgh is a fine homework name", truth: "Use names like math-hw-may.txt", sceneMyth: 3 },
 { claim: "Cloud means never organize", truth: "Cloud still needs folders", sceneMyth: 4 },
 ],
 onDone: completeSub,
 });
}

function s9({ overlay, setCoach, completeSub }) {
 setCoach("Quick files fluency.");
 mountSpeedDrill(overlay, {
 scene: "filesDrill", title: "Fluency Drill", passScene: "filesMastery",
 items: [
 { q: "math-hw.txt belongs in...", opts: ["School folder", "asdfgh pile"], ok: 0, prompt: "HW" },
 { q: "eid.jpg belongs in...", opts: ["Photos/Media", "Only CPU"], ok: 0, prompt: "Pic" },
 { q: "Should you save before closing?", opts: ["Yes", "Never"], ok: 0, prompt: "Save" },
 { q: "asdfgh is a good name?", opts: ["No", "Yes"], ok: 0, prompt: "Name" },
 { q: "Folders help you...", opts: ["Find files", "Delete the CPU"], ok: 0, prompt: "Folder" },
 { q: "Cloud needs organization?", opts: ["Yes", "No"], ok: 0, prompt: "Cloud" },
 ],
 onDone: completeSub,
 });
}

function s10({ overlay, setCoach, completeSub }) {
 setCoach("Mastery - File Finder.");
 mountOrderSteps(overlay, {
 scene: "filesMastery", title: "File Finder Mastery", instructions: "Order your journey.",
 items: [
 { id: "meet", html: "Meet" }, { id: "sort", html: "Sort" }, { id: "lab", html: "Lab" },
 { id: "rule", html: "Rule" }, { id: "myth", html: "Myth" }, { id: "finder", html: "Finder" },
 ],
 correctIds: ["meet", "sort", "lab", "rule", "myth", "finder"],
 onDone: () => mountTapContinue(overlay, {
 scene: "filesMastery", badge: LAB_ASSET_PATHS.m3,
 html: `<h3>File Finder!</h3><p>You can name, folder, save, and find.</p>`,
 onDone: completeSub, advanceAfterDone: true,
 }),
 });
}
