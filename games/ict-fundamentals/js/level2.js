/**
 * ICT - Mission 2: Input & Output
 * Script: Opening + 4 Bruner spirals (input → output → both → full cycle) + recap.
 * Metaphor: kitchen order window (in) and serving counter (out).
 */
import { initIoSub, resetIoKitchenState, LAB_ASSET_PATHS, labState } from "./lab-state.js";
import { mountGate, mountSpiralMap, mountTapContinue, badgeHtml } from "./lab-activities.js";

export const L2_META = {
 objective:
 "By the end of this mission, you'll explain input devices, output devices, and I/O devices using the kitchen windows metaphor - in your own words.",
 bdHook:
 "Bangladesh everyday: typing homework, video-call mic and speaker, class tablet - notice what goes in and what comes out.",
 predict: {
 q: "Before we start - when you type and letters appear on screen, what mainly happened?",
 options: [
 "Input (keyboard) went in, computer processed, output (screen) came out",
 "The screen stored files forever by itself",
 "Heat melted the keyboard into text",
 ],
 ok: 0,
 },
 kidTitle: "Input & Output: How the Kitchen Talks to the World",
 theme: "input, output & I/O devices",
 emoji: "⌨️",
 rewardName: "Window Scout",
 intro:
 "Last time you met the chef, countertop, and pantry - but the kitchen was sealed. Today we cut the order window (input) and serving counter (output) so information can flow in both directions. Some devices even do both jobs at once.",
 everyday: ["Typing homework", "Video call mic & speaker", "Touchscreen tablet"],
 subTitles: [
 "Open the Windows",
 "Cut the Order Window",
 "Input Devices",
 "Cut the Serving Window",
 "Output Devices",
 "Touchscreen & Sort",
 "I/O Devices",
 "Run the Full Cycle",
 "Why I/O Matters",
 "The Kitchen Has Windows",
 ],
};

export function runL2Sub(subIndex, api) {
 const { registerTryAgain } = api;
 initIoSub(subIndex);
 const runners = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10];
 const fn = runners[subIndex] || runners[0];
 registerTryAgain(() => {
 api.overlay.innerHTML = "";
 resetIoKitchenState();
 initIoSub(subIndex);
 fn(api);
 });
 fn(api);
}

function n(text) {
 return `<p class="tiny-narration">${text}</p>`;
}

function s1_opening({ overlay, setCoach, completeSub }) {
 setCoach("Tap Open the Windows - the sealed kitchen from Mission 1 needs doors.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "ioOpen",
 badge: "Opening",
 title: "Input & Output: How the Kitchen Talks to the World",
 pulse: true,
 autoAdvanceOnReady: true,
 ready: () => labState.ioOpenReady || Date.now() - t0 > 6000,
 readyText: "No order window, no serving counter - yet.",
 doneLabel: "Continue ▶",
 controlsHtml: `<p class="drag-hint">Or tap here:</p>
 <button type="button" class="btn secondary" id="gate-open-windows">Open the Windows →</button>`,
 bind: (host, { finish, signalGateReady: signal }) => {
 host.querySelector("#gate-open-windows")?.addEventListener("click", () => {
 labState.ioOpenReady = true;
 signal?.({ forceAdvance: true });
 finish();
 });
 },
 html: `${badgeHtml(LAB_ASSET_PATHS.m2, "kitchen windows")}
 ${n(
 "Last time, you met the chef, the countertop, and the pantry - everything a computer needs to actually think. There's just one small problem: it's completely sealed. No order window, no serving counter. The most capable chef in the world is useless if no order can ever get in, and no dish can ever get out. Today, we're cutting the doors and windows into this kitchen.",
 )}`,
 onDone: completeSub,
 });
}

function s2_input1({ overlay, setCoach, completeSub }) {
 setCoach("Type at the sealed wall (nothing happens), then drag a keyboard to cut the order window.");
 mountGate(overlay, {
 scene: "ioInput1",
 badge: "Spiral 1 · Enactive",
 title: "Getting Orders In",
 pulse: true,
 ready: () => labState.ioTypedSealed && labState.ioOrderWindow && labState.ioTypedWindow,
 readyText: "Same instruction - the opening is what changed.",
 doneLabel: "Continue ▶",
 html: n(
 "Nothing about your typing changed between those two tries - what changed was whether there was any actual opening for that information to travel through. That's the entire job of an input device: it's the opening, the only path anything from the outside world has to reach the computer at all.",
 ),
 onDone: completeSub,
 });
}

function s3_input_terms({ overlay, setCoach, completeSub }) {
 setCoach("Watch the input gallery - every arrow points in - then read the formal definition.");
 mountGate(overlay, {
 scene: "ioInputGallery",
 badge: "Spiral 1 · Iconic",
 title: "Different Devices, Same Direction: In",
 ready: () => true,
 html: n(
 "A keyboard sends in letters and commands. A microphone sends in sound. A camera sends in images. Completely different kinds of information, but every single one is doing the exact same fundamental job: opening a path for something from the outside world to get in.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "ioTermsInput",
 html: `<h3>Spiral 1 · Symbolic</h3>
 <p><strong>Input device</strong> - hardware that sends information or instructions into a computer from the outside world.</p>
 <p><strong>Examples:</strong> keyboard, mouse, microphone, camera, touchscreen, game controller</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s4_output1({ overlay, setCoach, completeSub }) {
 setCoach("Tap Serve with no opening (stuck), then drag monitor/speaker/printer to cut serving windows.");
 mountGate(overlay, {
 scene: "ioOutput1",
 badge: "Spiral 2 · Enactive",
 title: "Sending Results Out",
 pulse: true,
 ready: () => (labState.ioServeAttempts || 0) >= 2 && labState.ioServingWindow && labState.ioOutputsAdded?.monitor,
 readyText: "Screen, speaker, printer - three ways a result can leave.",
 doneLabel: "Continue ▶",
 html: n(
 "A finished result is exactly as stuck as an unheard instruction, without the right opening to leave through. A screen lets it out as an image. A speaker lets it out as sound. A printer lets it out as ink on paper - different forms, but every one of them finally getting the result out to you.",
 ),
 onDone: completeSub,
 });
}

function s5_output_terms({ overlay, setCoach, completeSub }) {
 setCoach("Output gallery - arrows flipped outward - then the formal output definition.");
 mountGate(overlay, {
 scene: "ioOutputGallery",
 badge: "Spiral 2 · Iconic",
 title: "Different Devices, Same Direction: Out",
 ready: () => true,
 html: n(
 "Notice the arrows have completely flipped from Spiral 1 - input arrows all pointed in, and every single output arrow points out. That single reversed arrow is really the entire difference between the two categories.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "ioTermsOutput",
 html: `<h3>Spiral 2 · Symbolic</h3>
 <p><strong>Output device</strong> - hardware that sends information from a computer out to the user or outside world.</p>
 <p><strong>Examples:</strong> monitor/screen, speakers, printer, headphones</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s6_both1({ overlay, setCoach, completeSub }) {
 setCoach("Tap the touchscreen (in then out), then sort all six devices into Input / Output / Both.");
 mountGate(overlay, {
 scene: "ioBoth1",
 badge: "Spiral 3 · Enactive",
 title: "Some Do Both",
 pulse: true,
 ready: () => labState.ioTouchIn && labState.ioTouchOut && labState.ioSortDone,
 readyText: "Most devices do one job. A few genuinely do both.",
 doneLabel: "Continue ▶",
 html: n(
 "A touchscreen isn't a special exception to the input/output rule - it's simply one device doing two separate jobs at the same physical spot: your tap is an input, and the display responding is an output, happening together so smoothly it feels like one single action.",
 ),
 onDone: completeSub,
 });
}

function s7_both_terms({ overlay, setCoach, completeSub }) {
 setCoach("Three-zone diagram - then name I/O devices formally.");
 mountGate(overlay, {
 scene: "ioBothDiagram",
 badge: "Spiral 3 · Iconic",
 title: "Input Only · Output Only · Both",
 ready: () => true,
 html: n(
 "This overlap isn't a loophole in the definitions - it's just an honest reflection of what these devices actually do. A touchscreen taking your tap and a touchscreen showing you a picture are two separate jobs, running through the exact same piece of hardware.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "ioTermsBoth",
 html: `<h3>Spiral 3 · Symbolic</h3>
 <p><strong>I/O device</strong> - hardware that performs both input and output functions.</p>
 <p><strong>Examples:</strong> touchscreens, some game controllers, network cards, external hard drives</p>`,
 onDone: completeSub,
 });
 },
 });
}

function s8_cycle4({ overlay, setCoach, completeSub }) {
 setCoach("Run the full cycle: type at order window → chef uses RAM/storage → result at serving window.");
 mountGate(overlay, {
 scene: "ioCycle4",
 badge: "Spiral 4 · Enactive",
 title: "How It All Connects",
 pulse: true,
 ready: () => labState.ioCycleDone,
 readyText: "Input → CPU/RAM/Storage → Output - one complete journey.",
 doneLabel: "Continue ▶",
 html: n(
 "This is the complete journey, start to finish - input, through the exact CPU-and-memory system you already understand, and out again as output. And notice, it didn't actually matter which specific device supplied the input - a keyboard or a simple switch both send the same kind of information in, through the same kind of opening.",
 ),
 onDone: completeSub,
 });
}

function s9_access4({ overlay, setCoach, completeSub }) {
 setCoach("Accessibility montage - braille, voice, rumble - then the full summary card.");
 mountGate(overlay, {
 scene: "ioAccess4",
 badge: "Spiral 4 · Iconic",
 title: "Different Bodies, Same Idea",
 ready: () => true,
 html: n(
 "This is exactly why the range of real input and output devices in the world is so wide - not every person can use a keyboard, or see a screen, or hold a controller the same way. A braille display, a voice-controlled input, an adaptive switch - every one of them is solving the exact same problem you solved today, just built for a different person's needs.",
 ),
 onDone: () => {
 mountTapContinue(overlay, {
 scene: "ioTermsCycle",
 html: `<h3>Spiral 4 · Symbolic</h3>
 <ul class="bk-summary-list">
 <li><strong>Input device</strong> - sends information in</li>
 <li><strong>Output device</strong> - sends information out</li>
 <li><strong>I/O device</strong> - does both</li>
 <li><strong>Input → CPU/RAM/Storage → Output</strong> - the complete loop</li>
 </ul>
 <p><em>Next: what tells the chef which instructions to run? (Software & OS)</em></p>`,
 onDone: completeSub,
 });
 },
 });
}

function s10_closing({ overlay, setCoach, completeSub }) {
 setCoach("Watch traffic flow through both windows - then open the recap map.");
 const t0 = Date.now();
 mountGate(overlay, {
 scene: "ioClose",
 badge: "Closing",
 title: "The Kitchen Has Windows Now",
 html: n(
 "That sealed kitchen from the start of this lesson was never actually broken - it just had no way to talk to the outside world. Now it does, in both directions, and so does every real computer you'll ever use. Every keystroke, every tap, every sound you hear from a speaker, every page that prints - it's all just input and output, doing exactly the jobs their names say they do.",
 ),
 ready: () => labState.ioCloseU >= 0.5 || Date.now() - t0 > 7000,
 readyText: "Input and output - both directions, always.",
 doneLabel: "Open the recap map ▶",
 onDone: () => {
 setCoach("Tap a spiral number to replay, then finish Input & Output.");
 mountSpiralMap(overlay, {
 scene: "ioSpiral",
 title: "Your recap map",
 finishLabel: "Finish Input & Output ▶",
 narration:
 "The four numbers are the four spirals you finished. Tap a number to replay a highlight, then finish when ready.",
 statusIdle: "Tap a number to replay, or finish now.",
 stops: [
 { n: 1, label: "1: Input" },
 { n: 2, label: "2: Output" },
 { n: 3, label: "3: Both" },
 { n: 4, label: "4: Connect" },
 ],
 onDone: completeSub,
 });
 },
 });
}

const s1 = s1_opening;
const s2 = s2_input1;
const s3 = s3_input_terms;
const s4 = s4_output1;
const s5 = s5_output_terms;
const s6 = s6_both1;
const s7 = s7_both_terms;
const s8 = s8_cycle4;
const s9 = s9_access4;
const s10 = s10_closing;
